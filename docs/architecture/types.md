## Type System

CTI's type system is at the heart of the framework. Types serve as contracts between components, preventing mistakes and making code self-documenting.

### Philosophy

Types in CTI are:

- **Central.** Not an afterthought or optional layer.
- **Explicit.** No implicit any; types are declared clearly.
- **Enforced.** TypeScript catches mistakes at development time.
- **Documented.** A command's type signature is its documentation.

### Core Types

#### CommandModule

```typescript
interface CommandModule<F = Record<string, unknown>> {
  meta?: CommandMeta
  flags?: Record<string, FlagSpec>
  args?: ArgSpec[]
  run: (ctx: Context<F>) => void | number | Promise<void | number>
}

interface CommandMeta {
  description?: string
  aliases?: readonly string[]
  hidden?: boolean
  examples?: readonly string[]
}
```

A command is a module with:

- **meta** — Metadata (description, aliases, help)
- **flags** — Declared flags with types and specs
- **args** — Documented positional arguments
- **run** — The handler function

The `F` generic parameter allows commands to have strongly-typed flags:

```typescript
interface DeployFlags {
  environment: 'prod' | 'staging'
  force: boolean
}

const deployCommand = {
  flags: {
    environment: { type: 'string' as const, choices: ['prod', 'staging'] },
    force: { type: 'boolean' },
  },
  run: async (ctx: Context<DeployFlags>) => {
    const env = ctx.flags.environment // TypeScript knows this is string
    if (ctx.flags.force) {
      /* ... */
    }
  },
} satisfies CommandModule<DeployFlags>
```

#### FlagSpec

```typescript
interface FlagSpec {
  type: 'string' | 'boolean' | 'number'
  short?: string
  description?: string
  default?: string | boolean | number
  required?: boolean
  multiple?: boolean
  choices?: readonly string[]
  validate?: (value: unknown) => true | string
}
```

A flag specification declares:

- **type** — How to coerce the value (string, boolean, number)
- **short** — Short form (e.g., 'v' for -v)
- **description** — Help text
- **default** — Fallback if not provided
- **required** — Must be specified
- **multiple** — Can appear multiple times
- **choices** — Whitelist of allowed values
- **validate** — Custom validation logic

This is enough for most CLI tools. Complex validation can happen in the handler.

#### Context

```typescript
interface Context<F = Record<string, unknown>> {
  flags: F
  positionals: string[]
  route: string[]
  cwd: string
  env: Record<string, string | undefined>
  config: Config
  io: Io
  logger: Logger
}
```

Context is the runtime environment for a command:

- **flags** — Parsed and coerced flags (generic-typed)
- **positionals** — Remaining positional arguments
- **route** — The command path (e.g., ['deploy', 'aws'])
- **cwd** — Current working directory
- **env** — Environment variables
- **config** — Application configuration
- **io** — I/O interface (colours, prompts, etc.)
- **logger** — Structured logger

#### Io

```typescript
interface Io {
  isTTY: boolean
  colour: (text: string, colour: Colour) => string
  write: (text: string) => void
  writeError: (text: string) => void
  spinner: (text: string) => SpinnerHandle
  prompt: (question: string) => Promise<string>
  confirm: (question: string, fallback?: boolean) => Promise<boolean>
  select: <T extends string>(question: string, choices: readonly T[]) => Promise<T>
}

type Colour = 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'gray'

interface SpinnerHandle {
  update: (text: string) => void
  succeed: (text?: string) => void
  fail: (text?: string) => void
  stop: () => void
}
```

The I/O interface is the contract for terminal interaction. See [I/O System](io.md) for details.

#### Logger

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface Logger {
  level: LogLevel
  debug: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}
```

Simple, structured logging with four levels.

#### Manifest

```typescript
interface ManifestEntry {
  route: string[]
  sourcePath: string
  importer: () => Promise<{ default: CommandModule }>
  meta?: CommandMeta
}

interface Manifest {
  entries: ManifestEntry[]
}
```

The manifest maps routes to command modules and their lazy `importer`. It is built by `defineManifest()` and consumed by the router. See [Core Module](core.md) for details.

#### Config

```typescript
interface Config {
  name: string
  bin?: string
  commandsDir?: string
  version: string
  targets?: string[]
  manifest?: Manifest
}
```

Application configuration. Minimal; you can extend this with your own properties. If `bin` is not provided, it defaults to `name`. If `manifest` is set, `run()` uses it directly instead of discovering one from `commandsDir`.

### Design Decisions

#### Why Generics?

```typescript
interface Context<F = Record<string, unknown>> {
  /* ... */
}
```

The `F` generic allows:

```typescript
// Without generics
const ctx: Context = {
  flags: {
    /* any */
  },
}
const timeout = ctx.flags.timeout // any

// With generics
interface Flags {
  timeout: number
}
const ctx: Context<Flags> = {
  flags: {
    /* ... */
  },
}
const timeout = ctx.flags.timeout // number [Correct]
```

Strong typing of flags catches mistakes at development time.

#### Why Union Types for LogLevel?

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error'
```

Instead of enums or constants, union types:

- Are lightweight
- Don't require imports at runtime
- Are easy to extend if needed
- Work well with TypeScript's type narrowing

#### Why Optional Meta Fields?

```typescript
interface CommandModule {
  meta?: CommandMeta
  flags?: Record<string, FlagSpec>
  args?: ArgSpec[]
  run: (ctx: Context) => ...
}
```

Only `run` is required. Everything else is optional because:

- Simple commands don't need metadata
- Some commands have no flags or arguments
- The minimal interface encourages minimalism

You only declare what you need.

#### Why Readonly Choices?

```typescript
choices?: readonly string[]
```

`readonly` prevents accidental mutation:

```typescript
const spec = { choices: ['prod', 'staging'] }
spec.choices.push('dev') // TypeScript error
```

It's a small guardrail that prevents bugs.

### File Organization

Types are split across multiple files by domain:

- **command.d.ts** — Command module and flag types
- **context.d.ts** — Context interface
- **io.d.ts** — I/O and logger types
- **manifest.d.ts** — Manifest and discovery types
- **config.d.ts** — Configuration schema

This organisation:

- Makes the codebase navigable
- Reduces circular dependencies
- Allows granular imports

### Type-Driven Development

CTI encourages type-driven development:

1. **Define the types** — What does my command need?
2. **Write the handler** — Implement logic based on types
3. **TypeScript catches errors** — Impossible states are unrepresentable

This is more reliable than writing code first and validating later.

### Future Evolution

Types might evolve:

- **Branded types** — For stronger distinctions (e.g., `type Port = number & { readonly __port: unique symbol }`)
- **Stricter unions** — For command categories or permission levels
- **Discriminated unions** — For command variants with shared base types
- **Const parameters** — For compile-time string manipulation

These would be additive, preserving existing type signatures.

---

### Related

- **[System Design Overview](system-design.md)** — How types fit into the architecture
- **[Core Module](core.md)** — How types are used in parsing and routing
