# Validation

CTI provides validation for flags and positional arguments. Custom validation functions ensure that parsed values meet your requirements before the handler runs.

## Flag Validation

Add a `validate` function to any flag:

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

If validation fails, CTI prints the error message and exits with a usage error.

## Argument Validation

Positional arguments support validation too:

```typescript
args: [
  args.string({
    name: 'file',
    validate: (value) => {
      return value.endsWith('.ts') ? true : 'Must be a TypeScript file'
    },
  }),
]
```

## Return Value

Validation functions return:

- `true` if the value is valid
- A string error message if invalid

```typescript
validate: (value) => {
  if (isValid(value)) return true
  return 'Error message'
}
```

## Timing

Validation runs after type coercion:

1. Parse the argument
2. Coerce to the target type
3. Run validation
4. Attach to context

For a number flag, validation receives the number, not the string.

## Choices Constraint

Built-in validation for restricted values:

```typescript
flags: {
  format: flags.string({
    choices: ['json', 'csv', 'xml'] as const,
  })
}
```

## Common Patterns

### File Existence

```typescript
import { existsSync } from 'node:fs'

args: [
  args.string({
    name: 'file',
    validate: (value) => {
      return existsSync(value) ? true : 'File not found'
    },
  }),
]
```

### Port Range

```typescript
flags: {
  port: flags.number({
    validate: (value) => {
      const n = value as number
      return n >= 1 && n <= 65535 ? true : 'Port out of range'
    },
  })
}
```

### URL Format

```typescript
flags: {
  url: flags.string({
    validate: (value) => {
      try {
        new URL(value as string)
        return true
      } catch {
        return 'Invalid URL'
      }
    },
  })
}
```

### Email Address

```typescript
flags: {
  email: flags.string({
    validate: (value) => {
      const v = value as string
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : 'Invalid email'
    },
  })
}
```

## Error Handling

When validation fails, CTI:

1. Prints the error message
2. Exits with code 2 (usage error)
3. Does not run the command handler

This ensures only valid commands proceed.

## Async Validation

Validation functions are synchronous. For async validation (e.g., checking a database), validate in the handler:

```typescript
run({ flags, io }) {
  const isValid = await checkDatabase(flags.id)
  if (!isValid) {
    io.writeError('Invalid ID')
    return 1
  }
  // Proceed with valid data
}
```

## Multiple Constraints

Combine multiple checks:

```typescript
validate: (value) => {
  const v = value as string

  if (v.length < 3) return 'Minimum 3 characters'
  if (v.length > 100) return 'Maximum 100 characters'
  if (!/^[a-z0-9-]+$/i.test(v)) return 'Only alphanumeric and hyphens'

  return true
}
```

## User Feedback

Write clear, specific error messages. Avoid technical jargon:

```typescript
// Good: Clear and actionable
validate: (value) => {
  return value.length >= 1 ? true : 'Must not be empty'
}

// Less helpful
validate: (value) => {
  return value.length >= 1 ? true : 'Invalid input'
}
```
