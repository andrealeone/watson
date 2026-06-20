## API Reference

Complete type and function definitions for CTI.

### Types

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

A command module is the default export of a command file. It describes the command and provides the handler.

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

Specification for a command flag. Used in the `flags` object of a CommandModule.

#### ArgSpec

```typescript
interface ArgSpec {
  name: string
  description?: string
  required?: boolean
  variadic?: boolean
  validate?: (value: string) => true | string
}
```

Specification for a positional argument. Used in the `args` array of a CommandModule.

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

The runtime context passed to command handlers. Contains parsed flags, positionals, and access to I/O, logging, and configuration.

**Properties:**

- `flags: F` — Parsed and coerced flags. Generic-typed for safety.
- `positionals: string[]` — Remaining positional arguments
- `route: string[]` — Command path (e.g., `['deploy', 'aws']`)
- `cwd: string` — Current working directory
- `env: Record<string, string | undefined>` — Environment variables
- `config: Config` — Application configuration
- `io: Io` — I/O interface for user interaction
- `logger: Logger` — Structured logger

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

Interface for user interaction. Provided via `ctx.io`.

**Methods:**

- `colour(text, colour)` — Return coloured text for terminal output
- `write(text)` — Write to stdout
- `writeError(text)` — Write to stderr
- `spinner(text)` — Create a loading indicator
- `prompt(question)` — Request text input
- `confirm(question, fallback?)` — Request yes/no confirmation
- `select(question, choices)` — Present a choice menu

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

Structured logger. Provided via `ctx.logger`.

**Methods:**

- `debug(...args)` — Log at debug level (only if DEBUG env var set)
- `info(...args)` — Log at info level
- `warn(...args)` — Log at warn level (to stderr)
- `error(...args)` — Log at error level (to stderr)

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

Internal manifest used by the router for command discovery.

#### Config

```typescript
interface Config {
  name: string
  bin?: string
  commandsDir: string
  version: string
  targets?: string[]
}
```

Base configuration interface. Extend this with your own properties.

### Functions

**Core**

#### run

```typescript
function run(manifest: Manifest, config: Config, argv?: string[]): Promise<number>
```

The main dispatcher. Resolves `argv` (defaults to `Bun.argv.slice(2)`) against the manifest, parses and coerces flags, builds the `Context`, invokes the matched command, and resolves to the process exit code (the command's numeric return, or `0`). On an unknown command or a thrown error it writes to stderr and resolves to `1`.

#### defineManifest

```typescript
function defineManifest(routes: Record<string, CommandModule>): Manifest
```

Build a `Manifest` from a flat map of slash-delimited route to command module (`'users/list'` becomes `['users', 'list']`). Each entry gets an `importer` that resolves the given module.

#### buildRouteLookup

```typescript
function buildRouteLookup(manifest: Manifest): Map<string, ManifestEntry>
```

Build a lookup map from manifest entries for fast route resolution.

#### resolveRoute

```typescript
function resolveRoute(
  args: string[],
  lookup: Map<string, ManifestEntry>,
): { entry: ManifestEntry; remaining: string[] } | null
```

Resolve a command route from arguments. Returns the matching entry and remaining arguments, or null if not found.

#### parseAndCoerce

```typescript
function parseAndCoerce(
  args: string[],
  flags: Record<string, FlagSpec>,
): { values: Record<string, unknown>; positionals: string[] }
```

Parse arguments and coerce flag values to their declared types.

**I/O**

#### createIo

```typescript
function createIo(): Io
```

Create an I/O interface instance.

#### createLogger

```typescript
function createLogger(): Logger
```

Create a logger instance.

#### colourize

```typescript
function colourize(text: string, colour: Colour): string
```

Return coloured text (respecting TTY and NO_COLOR).

#### createSpinner

```typescript
function createSpinner(text: string): SpinnerHandle
```

Create a spinner instance.

**Utilities**

#### coerceValue

```typescript
function coerceValue(value: unknown, spec: FlagSpec): unknown
```

Coerce a value to its declared type (string, number, boolean).

#### shouldUseColour

```typescript
function shouldUseColour(): boolean
```

Determine if colour should be used (respecting TTY, NO_COLOR, FORCE_COLOR).

#### isTTY

```typescript
function isTTY(): boolean
```

Determine if stdout is a TTY.

### Module Exports

#### src/types/

All type definitions are re-exported from type files:

```typescript
import type { CommandModule, FlagSpec, ArgSpec } from './types/command'
import type { Context } from './types/context'
import type { Config } from './types/config'
import type { Io, Logger, Colour, SpinnerHandle } from './types/io'
import type { Manifest, ManifestEntry } from './types/manifest'
```

#### src/core/

```typescript
import { defineManifest, run } from './core/runtime'
import { buildRouteLookup, resolveRoute } from './core/router'
import { parseAndCoerce, toParseArgsOptions } from './core/parser'
```

#### src/io/

```typescript
import { createIo, createLogger } from './io/index'
import { colourize } from './io/colour'
import { createSpinner } from './io/spinner'
import { prompt, confirm, select } from './io/prompt'
```

#### src/utils/

```typescript
import { coerceValue } from './utils/coerce'
import { shouldUseColour, isTTY } from './utils/tty'
```

---

### Usage

Import types and functions as needed, then dispatch with `run`:

```typescript
import type { CommandModule } from './types/command'
import type { Config } from './types/config'
import { defineManifest, run } from './core/runtime'

const hello: CommandModule = {
  run: (ctx) => {
    ctx.io.write('Hello!')
  },
}

const manifest = defineManifest({ hello })
const config: Config = { name: 'demo', commandsDir: 'commands', version: '1.0.0' }
process.exit(await run(manifest, config))
```
