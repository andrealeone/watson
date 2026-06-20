# Context

The context object is passed to every command handler and contains all the information the command needs: parsed flags, positional arguments, the current route, I/O utilities, environment, and more.

## Context Interface

Every command's `run` function receives a context object:

```typescript
export interface Context<F = Record<string, unknown>> {
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

## Flags

The `flags` object contains parsed and coerced flag values, typed according to the command's flag definitions:

```typescript
flags: {
  verbose: flags.boolean({ short: 'v' }),
  count: flags.number({ default: 1 }),
}
run({ flags }) {
  console.log(flags.verbose)  // boolean
  console.log(flags.count)    // number
}
```

## Positionals

The `positionals` array contains positional arguments in order:

```typescript
run({ positionals }) {
  const source = positionals[0]
  const dest = positionals[1]
}
```

## Route

The `route` array is the command's path. For `app db migrate`, the route is `['db', 'migrate']`:

```typescript
run({ route }) {
  console.log(route.join(' '))  // 'db migrate'
}
```

Useful for:

- Logging which command ran
- Nested commands that need to know their own path
- Building help text

## Working Directory

The `cwd` string is the current working directory:

```typescript
run({ cwd }) {
  console.log(`Running in ${cwd}`)
}
```

## Environment Variables

The `env` object contains all environment variables:

```typescript
run({ env }) {
  const apiKey = env.API_KEY
  const debug = env.DEBUG
}
```

## Config

The `config` object contains CTI configuration:

```typescript
export interface Config {
  name: string // CLI name from package.json
  bin: string // Entrypoint binary name
  commandsDir: string // Commands directory path
  version: string // Version from package.json
  targets?: string[] // Compile targets
}
```

```typescript
run({ config }) {
  io.write(`${config.name} v${config.version}`)
}
```

## I/O Kit

The `io` object provides output methods, colors, spinners, and prompts:

```typescript
run({ io }) {
  io.write('Output')
  io.writeError('Error')
  const colored = io.colour('text', 'green')
  const spinner = io.spinner('Loading...')
}
```

## Logger

The `logger` object provides structured logging:

```typescript
run({ logger }) {
  logger.info('Command started')
  logger.debug('Debug info')
  logger.warn('Warning')
  logger.error('Error')
}
```

## Type Safety

The flags in the context are fully typed based on your flag declarations:

```typescript
flags: {
  port: flags.number({ default: 8080 })
}
run({ flags }) {
  // flags.port is a number, no casting needed
  const url = `http://localhost:${flags.port}`
}
```

## Single Writer Pattern

The context is read-only in handlers. It's the only object a handler reads, and the dispatcher is the only writer. This keeps behavior pure and testable.
