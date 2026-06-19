## I/O System

Watson's I/O module provides primitives for terminal interaction. These are the building blocks of user-friendly CLIs.

### Overview

The I/O system consists of:

- **Colour** — Terminal colour output with smart TTY detection
- **Spinner** — Loading indicators for long-running operations
- **Prompt** — User input (text, yes/no, selection)
- **Logger** — Structured logging with levels

All of these respect terminal capabilities. If stdout isn't a TTY (e.g., piping to a file), smart decisions are made (colours disabled, spinners silent, etc.).

### Architecture

#### Factory Pattern

The I/O system uses a factory pattern:

```typescript
export function createIo(): Io {
  return {
    isTTY: isTTY(),
    colour: colourize,
    write: (text) => process.stdout.write(text + '\n'),
    writeError: (text) => process.stderr.write(text + '\n'),
    spinner: createSpinner,
    prompt,
    confirm,
    select,
  }
}

export function createLogger(): Logger {
  return {
    level: 'info',
    debug: (...args) => {
      /* ... */
    },
    info: (...args) => {
      /* ... */
    },
    warn: (...args) => {
      /* ... */
    },
    error: (...args) => {
      /* ... */
    },
  }
}
```

Both are created once and passed through the context. This allows:

- **Dependency injection** — I/O is mockable for testing
- **Consistency** — All commands use the same I/O instance
- **Flexibility** — You can replace the I/O interface for custom behaviour

#### Io Interface

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
```

Simple, explicit, and sufficient for 99% of CLI use cases.

### Colour System

#### Implementation

```typescript
const ANSI_COLOURS: Record<Colour, string> = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

const ANSI_RESET = '\x1b[0m'

export function colourize(text: string, colour: Colour): string {
  if (!shouldUseColour()) return text
  return `${ANSI_COLOURS[colour]}${text}${ANSI_RESET}`
}
```

**Why ANSI codes?**

1. **No dependencies** — Built into terminals, no library needed
2. **Portable** — Works on macOS, Linux, Windows (via ConEmu, Windows Terminal, etc.)
3. **Minimal** — Eight colours cover 99% of use cases
4. **Fast** — String concatenation is trivial

**Why not RGB or true colour?**

Watson prioritises simplicity. Eight semantic colours (red for error, green for success, etc.) are enough. If you need more, you can use ANSI codes directly in your strings.

#### TTY Detection

The colour system respects terminal capabilities:

```typescript
function shouldUseColour(): boolean {
  if (process.env.NO_COLOR) return false // User disabled colour
  if (process.env.FORCE_COLOR) return true // User forced colour
  return process.stdout.isTTY === true // Auto-detect TTY
}
```

This means:

- Interactive terminal → Colours enabled
- Piped to file → Colours disabled (output is clean)
- CI environment → Respects NO_COLOR or FORCE_COLOR env vars

Users have control. Sensible defaults. No surprises.

### Spinner

The spinner (loading indicator) is intentionally minimal:

```typescript
export function createSpinner(_text: string): SpinnerHandle {
  return {
    update: () => {},
    succeed: () => {},
    fail: () => {},
    stop: () => {},
  }
}
```

**This is a stub.** Watson's current implementation is a placeholder. Future versions will implement:

```typescript
export function createSpinner(text: string): SpinnerHandle {
  let frame = 0
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

  return {
    update: (newText) => {
      // Clear line, print frame + newText
    },
    succeed: (finalText) => {
      // Replace spinner with success indicator and finalText
    },
    fail: (finalText) => {
      // Replace spinner with failure indicator and finalText
    },
    stop: () => {
      // Clear the line
    },
  }
}
```

#### Design Rationale

**Why a stub for now?** Because Watson is being built incrementally. The interface is solid; the implementation will follow.

When fully implemented, the spinner will:

- Animate in non-TTY environments silently (never block)
- Respect NO_COLOR
- Clear its line properly
- Handle terminal width gracefully

### Prompt System

User input primitives are currently stubs:

```typescript
export async function prompt(_question: string): Promise<string> {
  return ''
}

export async function confirm(_question: string, fallback?: boolean): Promise<boolean> {
  return fallback ?? false
}

export async function select<T extends string>(
  _question: string,
  _choices: readonly T[],
): Promise<T> {
  return _choices[0]!
}
```

When implemented, these will:

- `prompt()` — Read a line of text from stdin, return the trimmed input
- `confirm()` — Ask yes/no, accept 'y', 'yes', 'n', 'no' (case-insensitive)
- `select()` — Present a numbered list, read user choice, return selection

They'll also respect non-TTY environments, using fallbacks gracefully.

### Logger

The logger provides structured output with levels:

```typescript
export function createLogger(): Logger {
  return {
    level: 'info',
    debug: (...args) => {
      if (process.env.DEBUG) {
        console.log('[DEBUG]', ...args)
      }
    },
    info: (...args) => {
      console.log('[INFO]', ...args)
    },
    warn: (...args) => {
      console.warn('[WARN]', ...args)
    },
    error: (...args) => {
      console.error('[ERROR]', ...args)
    },
  }
}
```

**Design:**

- **Level-based filtering** — `DEBUG` env var controls debug output
- **Prefixed output** — Each level is prefixed ([DEBUG], [INFO], etc.)
- **Stderr for errors/warnings** — Standard UNIX convention
- **Stdout for info/debug** — Allows piping output cleanly

Users can replace the logger with their own (Winston, Pino, etc.) if needed.

### Design Philosophy

#### Keep It Simple

Watson's I/O primitives are:

- **Thin wrappers** around process.stdout, stdin, ANSI codes
- **Stateless where possible** (colours, colouring functions are pure)
- **Async only where necessary** (prompts must wait for user input)

This means:

- Small code surface
- Easy to understand
- Easy to extend or replace

#### No External Dependencies

ANSI codes are built into terminals. Spinners and prompts are straightforward to implement. Why add a dependency?

If you want a rich terminal UI (tables, layouts, etc.), you can use a library alongside Watson. Watson doesn't prevent that.

#### Respect the Environment

Every I/O decision respects:

- **TTY vs non-TTY** — Is stdout interactive?
- **Environment variables** — NO_COLOR, FORCE_COLOR, DEBUG
- **User preferences** — Can be overridden programmatically

This makes CLIs well-behaved in all contexts: interactive shells, CI pipelines, log files.

### Future Evolution

Watson's I/O system will likely gain:

- **Full prompt implementation** — Text input, selection, yes/no
- **Spinner animation** — Real loading indicators
- **Progress bars** — For operations with measurable progress
- **Table formatting** — For structured output
- **Theming** — Customisable colour schemes
- **Accessibility** — Support for screen readers and high-contrast modes

All of these would be additive, preserving the current interface.

---

### Related

- **[System Design Overview](system-design.md)** — Context
- **[Utils: TTY Detection](utils.md)** — Terminal capability detection
- **[Type System: Io Interface](types.md)** — Full type definitions
