# Logger

Watson provides a built-in logger for structured logging. The logger respects the `DEBUG` environment variable and provides four log levels.

## Logger Interface

Every command receives a `logger` object in the context:

```typescript
export interface Logger {
  level: LogLevel
  debug: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}
```

## Log Levels

Watson supports four log levels: `debug`, `info`, `warn`, and `error`.

```typescript
run({ logger }) {
  logger.debug('Detailed information for debugging')
  logger.info('General informational message')
  logger.warn('Warning about potential issues')
  logger.error('Error that occurred')
}
```

## Debug Logging

Debug messages are only printed when the `DEBUG` environment variable is set:

```bash
app command              # Debug logs hidden
DEBUG=1 app command      # Debug logs visible
```

```typescript
run({ logger }) {
  logger.debug('This only shows with DEBUG=1')
}
```

## Info, Warn, Error

These levels always print:

```typescript
run({ logger }) {
  logger.info('Always visible')
  logger.warn('Always visible')
  logger.error('Always visible')
}
```

## Prefixed Output

Each log level is prefixed for easy identification:

```
[DEBUG] Detailed information
[INFO] General message
[WARN] Warning message
[ERROR] Error message
```

## Multiple Arguments

Log methods accept multiple arguments:

```typescript
logger.info('User logged in:', user.name, 'from', user.ip)
// Output: [INFO] User logged in: alice from 192.168.1.1
```

## Use Cases

The logger is useful for:

- Debugging during development
- Tracing command execution
- Recording warnings about deprecated options
- Reporting errors with context
- Non-critical diagnostic information

## Difference from io.write()

- `io.write()` is for user-facing output
- `logger` is for diagnostic and debug messages
- Use `io.write()` for normal output
- Use `logger` for development and troubleshooting

## Context Access

The logger is always available in the command context:

```typescript
export interface Context {
  logger: Logger
  // ... other properties
}
```

## Standard Output

Logger methods write to `console` (stdout/stderr), keeping output mixed with command output. For clean separation, use `io.writeError()` for errors that should be distinct.
