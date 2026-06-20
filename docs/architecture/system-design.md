## System Design Overview

CTI is organised into focused modules. Each has a single responsibility and a clear interface.

```
┌────────────────────────────────────┐
│            Your Commands            │
├────────────────────────────────────┤
│  Runtime + Router (dispatch, manifest resolution)
├────────────────────────────────────┤
│  Parser (args → structured data)   │
├────────────────────────────────────┤
│  I/O (colours, prompts, spinners)  │
├────────────────────────────────────┤
│   Types (interfaces & contracts)   │
├────────────────────────────────────┤
│  Utils (coercion, TTY detection)   │
├────────────────────────────────────┤
│    Bun & Node.js stdlib            │
└────────────────────────────────────┘
```

### Module Breakdown

#### Core (`src/core/`)

**Runtime**, **Router**, and **Parser** live here. They form CTI's command dispatch engine.

- **Runtime** — The `run()` dispatcher and the `defineManifest()` builder
- **Router** — Resolves command names from a manifest (longest-prefix match), loads modules
- **Parser** — Converts raw `argv` into typed flags and positionals

[Deep dive: Core Module](core.md)

#### I/O (`src/io/`)

Terminal interaction primitives. Colours, prompts, spinners, and logging.

- **Colour** — ANSI colour output with smart TTY detection
- **Spinner** — Loading indicators
- **Prompt** — User input (text, yes/no, selection)
- **Logger** — Structured logging with levels

[Deep dive: I/O System](io.md)

#### Types (`src/types/`)

Type definitions and contracts for the entire system.

- **Command** — Command module shape and flag specifications
- **Context** — The runtime context passed to handlers
- **Manifest** — Command discovery and loading metadata
- **Config** — Application configuration schema
- **I/O** — I/O interface and logger types

[Deep dive: Type System](types.md)

#### Utils (`src/utils/`)

Helper functions for common tasks.

- **Coerce** — Type coercion (string to number, boolean, etc.)
- **TTY** — Terminal capabilities detection (is stdout a TTY? Should we use colour?)

[Deep dive: Utilities](utils.md)

### Data Flow

#### Invocation

```
User runs: my-cli deploy --env=prod
  ↓
Shell splits into: ['deploy', '--env=prod']
  ↓
run() (the dispatcher) receives argv
```

#### Parsing

```
Parser.parseAndCoerce(['--env=prod'], flagSpecs)
  ↓
Uses Node's parseArgs to tokenise
  ↓
Coerces values to declared types (string → number, etc.)
  ↓
Returns { values: { env: 'prod' }, positionals: [] }
```

#### Resolution

```
Router builds lookup: { 'deploy': ManifestEntry }
  ↓
Router resolves route: ['deploy'] matches entry
  ↓
Entry has importer function: () => import('./commands/deploy.ts')
```

#### Execution

```
Command module loaded
  ↓
Context created: { flags: {...}, positionals: [...], io: {...}, ... }
  ↓
command.run(ctx) invoked
  ↓
Command uses ctx.io to interact with user
  ↓
Process exits with status code
```

### Design Principles

#### Layering

Each layer has a well-defined responsibility:

- **Router** doesn't parse arguments; it asks Parser
- **Parser** doesn't know about types beyond the spec it receives
- **I/O** doesn't manage colour logic separately; it asks TTY utilities
- **Utilities** are stateless helpers with no dependencies on other modules

This layering makes the system:

- **Testable** — Each layer can be tested in isolation
- **Composable** — Layers can be replaced or extended
- **Understandable** — Data flows in one direction

#### Contracts

Each module has a clear interface:

```typescript
// Router's contract
export function resolveRoute(args, lookup): { entry; remaining } | null
export function buildRouteLookup(manifest): Map

// Parser's contract
export function parseAndCoerce(args, flags): { values; positionals }

// I/O's contract
export function createIo(): Io
export function createLogger(): Logger
```

Interfaces are small and stable. Implementations can evolve; contracts don't break.

#### Minimal Dependencies

CTI's core has zero npm dependencies. It uses:

- **Bun's native TypeScript support** (no build step)
- **Node's `util.parseArgs`** (argument parsing)
- **Node's `process` module** (environment, exit codes)
- **ANSI escape codes** (colour output)

This minimalism means:

- Fast startup (no dependency tree to load)
- Small binaries (no unused code)
- Reliability (fewer moving parts)
- Clarity (you can read the source in an afternoon)

#### Type Safety

Types are not optional. They're central to CTI's design:

- Commands declare flag types → Parser coerces to those types
- Context is fully typed → Commands can't access non-existent properties

This means you catch mistakes at development time, not runtime.

---

### Next Steps

- **[Core Module](core.md)** — Router and parser deep dive
- **[I/O System](io.md)** — Terminal interaction design
- **[Type System](types.md)** — How types shape CTI
- **[All Architecture Docs](../architecture/)** — Complete module reference
