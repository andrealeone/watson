# Flag Parsing

Watson provides typed, zero-overhead flag parsing built on Node's `util.parseArgs`. Every flag is declared with its type, default, and validation rules, and the parser ensures values match their specification.

## Flag Types

Watson supports three flag types: `string`, `boolean`, and `number`.

```typescript
import { createCLI } from 'watson'

export default command({
  flags: {
    verbose: flags.boolean({ short: 'v' }),
    count: flags.number({ default: 1 }),
    output: flags.string({ short: 'o' }),
  },
  run({ flags }) {
    console.log(flags.verbose, flags.count, flags.output)
  },
})
```

## Short Aliases

Flags can have single-character short forms, passed with `-` instead of `--`:

```bash
app --verbose          # same as:
app -v                 # short form

app --output file.txt  # same as:
app -o file.txt
```

## Flag Defaults

Provide a default value that matches the flag's declared type:

```typescript
flags: {
  steps: flags.number({ default: 1 }),      // valid
  format: flags.string({ default: 'json' }), // valid
  // format: flags.string({ default: 1 }) // ERROR: type mismatch
}
```

## Multiple Values

Flags can accept multiple values using the `multiple` option:

```typescript
flags: {
  tags: flags.string({ multiple: true })
}
```

Used as:

```bash
app --tags foo --tags bar  # flags.tags = ['foo', 'bar']
```

## Required Flags

Mark a flag as required when it must always be provided:

```typescript
flags: {
  apiKey: flags.string({ required: true })
}
```

## Choices Constraint

Restrict a flag to specific values:

```typescript
flags: {
  format: flags.string({
    choices: ['json', 'csv', 'xml'] as const,
  })
}
```

## Validation

Custom validation functions reject invalid values:

```typescript
flags: {
  port: flags.number({
    validate: (value) => {
      const num = value as number
      return num > 0 && num < 65536 ? true : 'Port must be 1-65535'
    },
  })
}
```

## Flag Parsing Flow

1. Arguments are tokenized using Node's `parseArgs`
2. Each token is coerced to its declared type
3. Validation rules are applied
4. Defaults fill in missing values
5. The typed flags object is attached to the context
