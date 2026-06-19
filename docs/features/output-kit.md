# Output Kit

The output kit provides a TTY-aware interface for writing to stdout/stderr, coloring text, showing spinners, and prompting users. All methods respect `NO_COLOR` and gracefully degrade when output is not a terminal.

## Io Interface

Every command receives an `io` object in the context with these methods:

```typescript
export interface Io {
  isTTY: boolean
  write: (text: string) => void
  writeError: (text: string) => void
  colour: (text: string, colour: Colour) => string
  spinner: (text: string) => SpinnerHandle
  prompt: (question: string) => Promise<string>
  confirm: (question: string) => Promise<boolean>
  select: <T extends string>(question: string, choices: T[]) => Promise<T>
}
```

## Writing Output

Use `io.write()` for normal output and `io.writeError()` for errors:

```typescript
run({ io }) {
  io.write('Operation complete')
  io.writeError('Something went wrong')
}
```

Both methods add a newline automatically.

## TTY Detection

Check whether output is a terminal:

```typescript
run({ io }) {
  if (io.isTTY) {
    // Interactive features available
    io.write('Running in terminal')
  } else {
    // Piped output
    io.write('Running in pipe')
  }
}
```

When not a TTY, interactive features degrade gracefully.

## NO_COLOR Support

The output kit respects the `NO_COLOR` environment variable. When set, all color is stripped regardless of TTY status. This follows the [NO_COLOR](https://no-color.org) standard.

```bash
NO_COLOR=1 app command  # No colors in output
```

## FORCE_COLOR Support

Force color output even when not a TTY:

```bash
FORCE_COLOR=1 app command | cat  # Colors preserved
```

## Availability

The output kit is always available through `ctx.io`, regardless of the command's purpose or context.
