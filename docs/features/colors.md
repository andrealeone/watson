# Colors

CTI provides a simple color interface using ANSI escape sequences. The coloring layer respects `NO_COLOR` and only applies colors when output is a terminal.

## Color Function

Use `io.colour()` to wrap text with color:

```typescript
run({ io }) {
  const success = io.colour('Done!', 'green')
  const error = io.colour('Failed!', 'red')
  io.write(success)
  io.writeError(error)
}
```

## Available Colors

CTI supports these ANSI colors:

- `red` — For errors and warnings
- `green` — For success messages
- `yellow` — For warnings and caution
- `blue` — For informational text
- `magenta` — For emphasis
- `cyan` — For secondary information
- `gray` — For de-emphasized text

## TTY Awareness

Color codes are only added when output is a terminal (TTY). When piped or redirected, the plain text is returned:

```bash
app command              # Colors applied if terminal
app command | cat        # No colors in output
NO_COLOR=1 app command   # No colors even if terminal
```

## Composable Output

Build colored output by combining the color function with strings:

```typescript
run({ io }) {
  const status = io.colour('[OK]', 'green')
  const msg = `${status} Operation complete`
  io.write(msg)
}
```

## Respecting NO_COLOR

The `NO_COLOR` environment variable disables all coloring. This is useful for CI/CD pipelines and logging systems that don't support ANSI codes.

```bash
NO_COLOR=1 app command  # Returns plain text
```

## ANSI Directly

The color function uses ANSI escape sequences. For custom styling, use the codes directly:

```typescript
// Gray text
const gray = '\x1b[90mText\x1b[0m'
```

## Performance

The color function is pure and has no side effects. It's safe to call for every line of output without performance concerns.
