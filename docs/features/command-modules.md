# Command Modules

A command module is the default export of a command file. It defines what the command does, what arguments it accepts, and how it runs.

## Command Module Structure

Every command file exports a command module with this shape:

```typescript
import { command, args, flags } from 'watson'

export default command({
  meta: {
    description: 'What this command does',
    examples: ['app db migrate', 'app db migrate --steps 2'],
  },
  flags: {
    steps: flags.number({ default: 1, describe: 'Migrations to apply' }),
  },
  args: [args.string({ name: 'target', required: false, describe: 'Database' })],
  run({ flags, args, io }) {
    io.write(`Applying ${flags.steps} migrations to ${args[0] || 'default'}`)
  },
})
```

## Metadata

The `meta` object contains optional command information:

```typescript
meta: {
  description: 'Describe what the command does',
  aliases: ['migrate', 'sync'],
  hidden: false,
  examples: ['app db migrate', 'app db migrate --steps 5'],
}
```

- `description`: Short explanation for help text
- `aliases`: Alternative names for the command
- `hidden`: Hide from help listings
- `examples`: Show usage in help

## Flags

The `flags` object defines available command-line flags:

```typescript
flags: {
  verbose: flags.boolean({ short: 'v' }),
  count: flags.number({ default: 1 }),
  output: flags.string({ short: 'o' }),
}
```

Available flag methods:

- `flags.string(...)` — Text value
- `flags.number(...)` — Numeric value
- `flags.boolean(...)` — True/false flag

## Arguments

The `args` array defines positional arguments:

```typescript
args: [
  args.string({ name: 'source', required: true }),
  args.string({ name: 'dest', required: false }),
  args.rest({ name: 'extra' }),
]
```

Available arg methods:

- `args.string(...)` — Text argument
- `args.number(...)` — Numeric argument
- `args.rest(...)` — Remaining arguments

## Run Handler

The `run` function is the command's implementation:

```typescript
run({ flags, positionals, route, io, logger, config, cwd, env }) {
  // Command logic here
  // Can be async: run: async ({ ... }) => { ... }
}
```

Returns:

- Nothing (exit code 0)
- A number (exit code)
- A Promise (async handler)

## Nested Commands

Nested commands work the same way. A file at `commands/db/migrate.ts` defines the nested command:

```typescript
// commands/db/migrate.ts
export default command({
  describe: 'Run pending migrations',
  run({ io }) {
    io.write('Running migrations...')
  },
})
```

Invoked as:

```bash
app db migrate
```

## Type Safety

Flags and arguments are fully typed:

```typescript
flags: {
  port: flags.number()
}
run({ flags }) {
  // flags.port is a number, no casting needed
  const url = `http://localhost:${flags.port}`
}
```

## The command() Wrapper

Always wrap command definitions with `command()`:

```typescript
export default command({
  // ...
})
```

The wrapper:

- Validates the command definition
- Ensures type consistency
- Provides error messages at load time
- Is the only extension point for future Watson features

## Minimal Command

A command needs only a `run` function:

```typescript
export default command({
  run({ io }) {
    io.write('Hello!')
  },
})
```

Everything else is optional.

## Context Parameter

The `run` handler receives one parameter, the context:

```typescript
run(ctx) {
  // All properties available on ctx
}

// Or destructure what you need:
run({ flags, io }) {
  // Only using flags and io
}
```

## Async Handlers

Make handlers async for long-running operations:

```typescript
run: async ({ io }) => {
  const spinner = io.spinner('Processing...')
  await longOperation()
  spinner.succeed()
}
```

## Exit Codes

Return an exit code:

```typescript
run({ io }) {
  if (error) {
    io.writeError('Failed!')
    return 1  // Exit with error code
  }
  return 0   // Success
}
```

If no value is returned, exit code is 0.
