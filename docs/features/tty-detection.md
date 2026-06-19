# TTY Detection

TTY detection determines whether the command's output is connected to a terminal (interactive) or piped/redirected (non-interactive). Watson uses this to adapt output and interactivity.

## What Is a TTY?

A TTY (teletypewriter) is a terminal device. When stdout/stderr is connected to a terminal, it's a TTY. When piped or redirected to a file, it's not.

```bash
app command              # stdout is a TTY
app command | cat        # stdout is not a TTY
app command > file.txt   # stdout is not a TTY
```

## Checking TTY Status

Every command can check if it's running interactively:

```typescript
run({ io }) {
  if (io.isTTY) {
    // Running in a terminal
    io.write('Interactive mode')
  } else {
    // Piped or redirected
    io.write('Non-interactive mode')
  }
}
```

## Adaptive Behavior

Watson adapts behavior based on TTY status:

**In a TTY:**

- Colors are applied
- Spinners animate
- Prompts work normally

**Not a TTY:**

- Colors are stripped
- Spinners output text without animation
- Prompts return defaults
- Output remains clean and parseable

## NO_COLOR Support

Respect the `NO_COLOR` environment variable to disable colors regardless of TTY:

```bash
NO_COLOR=1 app command  # No colors even in terminal
```

## FORCE_COLOR Support

Force colors even when not a TTY:

```bash
FORCE_COLOR=1 app command | cat  # Colors preserved in pipe
```

## Practical Example

Build commands that work everywhere:

```typescript
run({ io }) {
  const status = io.isTTY ? io.colour('[OK]', 'green') : '[OK]'
  io.write(`${status} Operation complete`)

  // Or let io.colour handle it automatically
  io.write(io.colour('Done', 'blue'))
}
```

The `colour` function already respects TTY, so you can use it always.

## Graceful Degradation

The I/O kit degrades gracefully:

- **Spinners**: Still work, but output once without animation
- **Colors**: Stripped when not a TTY
- **Prompts**: Return defaults without displaying anything
- **Output**: Always works

This ensures your CLI works:

- In terminals
- In pipes and redirects
- In CI/CD systems
- In scripts and automation

## Environment Detection

TTY detection uses `process.stdout.isTTY` (or similar for stderr). This is reliable across platforms.

## Use Cases

TTY detection is useful for:

- Choosing between human-readable and machine-readable output
- Deciding whether to show progress indicators
- Enabling/disabling interactive features
- Adapting output formatting

## Universal CLI Design

Design commands that work everywhere:

```typescript
// Good: Works in terminal, in pipes, in CI
const result = io.colour('Success', 'green')
io.write(result)

// Bad: Only works in terminal
io.write(io.spinner('...')) // Confusing in non-TTY
```

The output kit handles these concerns for you automatically.
