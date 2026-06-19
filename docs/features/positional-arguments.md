# Positional Arguments

Positional arguments are values passed after flags, in order. Watson provides strong typing and validation for positional arguments.

## Declaring Arguments

Arguments are declared in the `args` array of a command module:

```typescript
import { command, args } from 'watson'

export default command({
  args: [
    args.string({ name: 'source', required: true, describe: 'Source file' }),
    args.string({ name: 'dest', required: false, describe: 'Destination file' }),
  ],
  run({ positionals }) {
    console.log(`Copying ${positionals[0]} to ${positionals[1]}`)
  },
})
```

## Required vs Optional

Mark an argument as required if it must be provided:

```typescript
args: [
  args.string({ name: 'file', required: true }), // must be provided
  args.string({ name: 'backup', required: false }), // optional
]
```

## Types

Positional arguments support `string` and `number` types:

```typescript
args: [args.string({ name: 'username' }), args.number({ name: 'port' })]
```

## Variadic Arguments

The `variadic` option collects remaining arguments into an array:

```typescript
args: [
  args.string({ name: 'command' }),
  args.rest({ name: 'args', describe: 'Additional arguments' }),
]
```

Used as:

```bash
app exec node --version extra args
# positionals = ['node', '--version', 'extra', 'args']
```

## Validation

Custom validation functions ensure argument values are valid:

```typescript
args: [
  args.string({
    name: 'file',
    validate: (value) => {
      return value.endsWith('.ts') ? true : 'File must be a TypeScript file'
    },
  }),
]
```

## Accessing Arguments

Arguments are available in `ctx.positionals` as an array:

```typescript
run({ positionals }) {
  const source = positionals[0]
  const dest = positionals[1]
  // ...
}
```

## Parsing Order

Positional arguments are parsed after flags:

```bash
app --verbose file.txt --output result.json
# Flags: verbose=true, output='result.json'
# Positionals: ['file.txt']
```

Arguments must come after all flags (unless using `--` to separate them).
