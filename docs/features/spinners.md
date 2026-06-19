# Spinners

Spinners provide animated loading indicators for long-running operations. Watson's spinner is TTY-aware and degrades gracefully when output is piped.

## Creating a Spinner

Use `io.spinner()` to create a spinner:

```typescript
run({ io }) {
  const spinner = io.spinner('Loading data...')

  // Do async work
  await longOperation()

  // Update or finish
  spinner.succeed('Data loaded!')
}
```

## SpinnerHandle Interface

The spinner object provides these methods:

```typescript
interface SpinnerHandle {
  update: (text: string) => void
  succeed: (text?: string) => void
  fail: (text?: string) => void
  stop: () => void
}
```

## Update Text

Change the spinner text while it's running:

```typescript
const spinner = io.spinner('Starting...')
spinner.update('In progress...')
spinner.succeed('Complete!')
```

## Success State

Mark the spinner as successful with `succeed()`:

```typescript
spinner.succeed() // Keep current text
spinner.succeed('Done!') // Update text and succeed
```

Success replaces the spinner with a checkmark (in terminals).

## Failure State

Mark the spinner as failed with `fail()`:

```typescript
spinner.fail() // Keep current text
spinner.fail('Failed!') // Update text and fail
```

Failure replaces the spinner with an X (in terminals).

## Explicit Stop

Stop the spinner without marking success or failure:

```typescript
spinner.stop()
```

## Graceful Degradation

When output is not a TTY (piped), spinners:

- Output the initial text immediately
- Don't animate or redraw
- Still support `update()`, `succeed()`, and `fail()`
- Keep output clean and readable

This ensures logs remain useful when captured to files or pipes.

## Use Cases

Spinners are ideal for:

- Loading remote data
- Long-running processes
- File operations
- Compilations and builds
- Any operation where progress feedback helps

## Error Handling

Always clean up spinners in error cases:

```typescript
const spinner = io.spinner('Processing...')
try {
  await process()
  spinner.succeed()
} catch (error) {
  spinner.fail(`Error: ${error.message}`)
  throw error
}
```
