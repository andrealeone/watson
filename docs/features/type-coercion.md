# Type Coercion

Watson automatically converts parsed string values into their declared types. The coercion layer ensures type safety without manual casting.

## How Coercion Works

Since Node's `parseArgs` only handles `string` and `boolean` types, Watson adds a coercion layer that:

1. Tokenizes arguments using `parseArgs`
2. Reads the declared flag type from the command module
3. Converts the parsed string value to the target type
4. Validates the result

## String Coercion

String values pass through unchanged:

```typescript
flags: {
  name: flags.string()
}
// Input: --name Alice → flags.name = 'Alice'
```

## Number Coercion

String values are converted to numbers:

```typescript
flags: {
  count: flags.number()
}
// Input: --count 42 → flags.count = 42 (number)
// Input: --count abc → Error: invalid number
```

## Boolean Coercion

Boolean flags are handled natively by `parseArgs`:

```typescript
flags: {
  verbose: flags.boolean()
}
// Input: --verbose → flags.verbose = true
// Input: (no flag) → flags.verbose = false
```

## Default Handling

Defaults are coerced to the correct type:

```typescript
flags: {
  timeout: flags.number({ default: 5000 })
}
```

The default value `5000` is a number and stays a number; Watson never coerces defaults.

## Error on Invalid Coercion

If a value cannot be coerced to its declared type, parsing fails with a usage error:

```typescript
flags: {
  port: flags.number()
}
// Input: --port abc → Error: Cannot coerce 'abc' to number
```

## Multiple Values

When coercing multiple values, each value is coerced individually:

```typescript
flags: {
  ports: flags.number({ multiple: true })
}
// Input: --ports 8080 --ports 9000 → flags.ports = [8080, 9000]
```

## Custom Coercion with Validation

The `validate` option lets you apply custom logic after coercion:

```typescript
flags: {
  port: flags.number({
    validate: (value) => {
      const num = value as number
      return num >= 1 && num <= 65535 ? true : 'Invalid port'
    },
  })
}
```

Here, coercion converts the string to a number first, then validation checks the range.
