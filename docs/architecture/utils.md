## Utilities Module

The utilities module provides helper functions for common tasks across CTI. These are low-level, stateless utilities that other modules depend on.

### Organization

Two files, two responsibilities:

- **coerce.ts** — Type coercion (string → number, boolean, etc.)
- **tty.ts** — Terminal capability detection

### Coerce: Type Conversion

#### Purpose

After argument parsing, flag values are strings. The parser needs to convert them to their declared types.

```typescript
// User enters: --timeout=5000
// Parser extracts: { timeout: '5000' } (string)
// Coerce converts: { timeout: 5000 } (number)
```

#### Implementation

```typescript
export function coerceValue(value: unknown, spec: FlagSpec): unknown {
  if (value === undefined) {
    return undefined
  }

  if (spec.type === 'number') {
    const num = Number(value)
    if (Number.isNaN(num)) {
      throw new Error(`Invalid number: ${value}`)
    }
    return num
  }

  if (spec.type === 'boolean') {
    return value // Already boolean from parseArgs
  }

  return value // Strings pass through
}
```

**Design:**

- **Minimal.** Only handles the three types CTI supports
- **Strict.** Invalid numbers throw errors
- **Transparent.** Booleans already come from parseArgs; strings pass through unchanged

#### Type Handling

**Numbers:**

```typescript
coerceValue('42', { type: 'number' })
// → 42

coerceValue('abc', { type: 'number' })
// → throws Error: "Invalid number: abc"
```

**Booleans:**

```typescript
// parseArgs already converts 'true'/'false' to boolean
coerceValue(true, { type: 'boolean' })
// → true
```

**Strings:**

```typescript
coerceValue('hello', { type: 'string' })
// → 'hello'
```

#### Why Not More Complex Coercion?

CTI could support:

- Date parsing (string → Date)
- Regex parsing (string → RegExp)
- URL parsing (string → URL)
- Path normalisation

But this would:

- Add edge cases (what timezone for dates?)
- Create ambiguity (is '1.5' a float or version number?)
- Encourage bloat (custom types for every use case)

Instead, **coercion happens at the command level**:

```typescript
const createCommand = {
  flags: { birthdate: { type: 'string' } },
  run: async (ctx) => {
    const birthdate = new Date(ctx.flags.birthdate)
    // Validation happens here
  },
}
```

Handlers are responsible for semantic coercion. CTI handles type coercion.

#### Error Handling

Coercion errors are thrown immediately:

```typescript
try {
  const value = coerceValue('abc', { type: 'number' })
} catch (err) {
  // Error: "Invalid number: abc"
}
```

The router (or bootstrap code) catches these and displays a user-friendly error message.

### TTY: Terminal Detection

#### Purpose

CTI needs to know if stdout is interactive (a TTY) or piped (not a TTY). This affects:

- **Colour output** — Disable colours when piping to a file
- **Spinners** — Don't animate in non-interactive contexts
- **Prompts** — Don't wait for input if not a TTY

#### Implementation

```typescript
export function shouldUseColour(): boolean {
  if (process.env.NO_COLOR) {
    return false
  }
  if (process.env.FORCE_COLOR) {
    return true
  }
  return process.stdout.isTTY === true
}

export function isTTY(): boolean {
  return process.stdout.isTTY === true
}
```

**Decision tree:**

1. **NO_COLOR set?** → Never use colour (user preference)
2. **FORCE_COLOR set?** → Always use colour (user override)
3. **stdout is TTY?** → Colour is appropriate (interactive terminal)
4. **Otherwise** → No colour (piped, file, etc.)

#### Conventions

CTI respects two POSIX conventions:

- **[NO_COLOR](https://no-color.org/)** — Opt-out of all colour
- **FORCE_COLOR** — Used by many tools to force colour in CI environments

These give users control without breaking normal operation.

#### Examples

**Interactive terminal:**

```bash
$ my-cli deploy
# stdout.isTTY === true
# shouldUseColour() → true
# Output: Deploying... (in colour)
```

**Piped to file:**

```bash
$ my-cli deploy > output.log
# stdout.isTTY === false (writing to file)
# shouldUseColour() → false
# Output: Deploying... (plain text, no ANSI codes)
```

**Forced colour (CI):**

```bash
$ FORCE_COLOR=1 my-cli deploy > output.log
# shouldUseColour() → true
# Output: Deploying... (in colour, even when piped)
```

**Disabled colour:**

```bash
$ NO_COLOR=1 my-cli deploy
# shouldUseColour() → false
# Output: Deploying... (plain text, respecting user preference)
```

#### Why Detect TTY at Runtime?

CTI could require a flag: `--no-colour`. But detection is better because:

- **Zero configuration** — Works correctly by default
- **User-friendly** — Colours appear naturally in terminals
- **CI-aware** — Respects NO_COLOR and FORCE_COLOR automatically
- **Non-invasive** — Doesn't pollute command flags

The only reason to add `--no-colour` is if you want explicit control in edge cases.

### Design Philosophy

#### Keep Utilities Stateless

Utilities don't maintain state. They're pure functions (or nearly so):

```typescript
// [Good] Pure
shouldUseColour() // No side effects, always returns based on env/stdout

// [Bad] Stateful (avoided)
let colourEnabled = true
function setColourEnabled(bool) {
  colourEnabled = bool
}
function colourize() {
  /* uses colourEnabled */
}
```

Stateless utilities are:

- Easier to test
- Easier to reason about
- Easier to integrate
- Easier to replace or mock

#### Minimal, Focused Scope

Each utility does one thing:

- **coerce.ts** — Converts types
- **tty.ts** — Detects terminal capabilities

Not:

- **logging.ts** with complex logic
- **formatting.ts** with string manipulation
- **validation.ts** with schema enforcement

Focused scope means:

- Small code surface
- Easy to understand
- Easy to maintain
- Easy to test

#### No External Dependencies

Utilities use only JavaScript builtins and Node/Bun APIs:

- `Number()` for coercion
- `process.stdout.isTTY` for TTY detection
- `process.env` for environment variables

This means utilities are **always available** and **load instantly**.

### Future Possibilities

The utilities module might grow:

- **Path normalisation** — Handle cross-platform paths (Windows vs UNIX)
- **Template rendering** — Simple string interpolation
- **Configuration merging** — Combine multiple config sources
- **Environment loading** — Parse .env files
- **Exit code mapping** — Convert exceptions to exit codes

All of these would follow the same principles: minimal, focused, stateless.

---

### Related

- **[Core Module](core.md)** — How coerce is used in parsing
- **[I/O System](io.md)** — How TTY detection is used in colour
- **[Type System](types.md)** — FlagSpec types that coerce works with
