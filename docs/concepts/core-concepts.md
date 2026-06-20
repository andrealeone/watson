## Core Concepts

CTI's conceptual model is deliberately small. Understand these ideas and you understand the framework.

### Commands

A **command** is the basic unit of work in CTI. It's a module that receives parsed arguments and a context object.

```typescript
const deployCommand = {
  meta: { description: 'Deploy to production' },
  run: async (ctx: Context) => {
    const env = ctx.flags.environment
    ctx.io.write(`Deploying to ${env}...`)
  },
} satisfies CommandModule
```

A command is:

- **Explicit.** You see exactly what it does. No hidden routing, no magic.
- **Typed.** The `CommandModule` interface ensures consistency.
- **Composable.** Commands can call other commands or share utilities through plain modules.

### Context

The **Context** object is passed to every command. It's your access point to the runtime:

```typescript
interface Context {
  flags: Record<string, unknown> // Parsed flags
  positionals: string[] // Positional arguments
  route: string[] // Command path (e.g., ['deploy', 'staging'])
  cwd: string // Current working directory
  env: Record<string, string | undefined> // Environment variables
  config: Config // Application configuration
  io: Io // I/O interface (colours, prompts, spinners)
  logger: Logger // Structured logging
}
```

Context is your window into the runtime. Need environment variables? `ctx.env`. Want to write coloured output? `ctx.io.colour()`.

### Manifest

A **manifest** describes your CLI's commands and their loading strategy.

```typescript
interface Manifest {
  entries: ManifestEntry[]
}

interface ManifestEntry {
  route: string[]                              // e.g., ['deploy', 'aws']
  sourcePath: string                           // File path to the command
  importer: () => Promise<{ default: ... }>  // How to load the command
  meta?: CommandMeta                           // Metadata (description, examples)
}
```

The manifest is CTI's internal contract. It maps command names to modules, allowing lazy loading (only load a command when it's invoked).

### Runtime

The **runtime** is the entry point of your CLI. The `run()` dispatcher:

1. Accepts your config, which carries (or points to) a manifest of available commands
2. Resolves the command to invoke (longest-prefix match)
3. Loads the matched command module lazily
4. Parses and coerces incoming arguments
5. Builds the context and invokes the handler
6. Returns the process exit code

```typescript
import { defineManifest, run } from './core/runtime'

const config: Config = { ...baseConfig, manifest: defineManifest({ hello, goodbye }) }
process.exit(await run(config))
```

`defineManifest` maps slash-delimited routes (`'users/list'`) to command modules and is assigned to `config.manifest`; `run` does the dispatch. Route resolution and parsing live in the `router` and `parser` modules, which `run` composes.

### Flags and Arguments

CTI distinguishes between **flags** (named options) and **positionals** (ordered arguments).

```bash
my-cli deploy --environment=prod --verbose src/ dist/
```

This parses as:

```typescript
ctx.flags = {
  environment: 'prod',
  verbose: true,
}
ctx.positionals = ['src/', 'dist/']
```

Flags are declared in the command:

```typescript
const command = {
  flags: {
    environment: { type: 'string', default: 'staging' },
    verbose: { type: 'boolean', short: 'v' },
  },
  run: async (ctx) => {
    /* ... */
  },
}
```

Positionals are accessed dynamically: `ctx.positionals[0]`, `ctx.positionals[1]`, etc.

### Configuration

**Configuration** is the `Config` object you pass to `run()`: the CLI's name, bin, version, manifest (or `commandsDir` to discover one), and any other static data your commands need at runtime.

CTI doesn't impose a loader or enforce where config comes from. Build the object however suits you—a literal, parsed JSON/YAML, or environment variables—and hand it to `run`.

```typescript
const config: Config = { name: 'my-cli', version: '1.0.0', manifest: defineManifest({ hello }) }
process.exit(await run(config))
```

Configuration is then available to every command via `ctx.config`.

### I/O Interface

The **I/O interface** provides primitives for user interaction:

```typescript
interface Io {
  isTTY: boolean // Is stdout interactive?
  colour: (text: string, colour: Colour) => string // Coloured text
  write: (text: string) => void // Write to stdout
  writeError: (text: string) => void // Write to stderr
  spinner: (text: string) => SpinnerHandle // Loading indicator
  prompt: (question: string) => Promise<string> // User input
  confirm: (question: string) => Promise<boolean> // Yes/no prompt
  select: (question: string, choices) => Promise // Choose from list
}
```

These are straightforward, synchronous-where-possible, and designed for CLI patterns.

---

### How They Fit Together

When a user invokes your CLI:

1. **Argument parsing** — Shell breaks `my-cli deploy --env=prod src/` into tokens
2. **Manifest resolution** — Router looks up `deploy` in the manifest
3. **Command loading** — Command module is imported lazily
4. **Context creation** — `Context` is built with parsed flags, positionals, env, etc.
5. **Execution** — Command's `run()` function is invoked with the context
6. **I/O** — Command uses `ctx.io` to interact with the user
7. **Exit** — Process exits with status code (0 = success, non-zero = error)

That's the entire flow. Understand it, and you understand CTI.
