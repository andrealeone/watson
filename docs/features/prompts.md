# Prompts

Watson provides interactive prompting for text input, yes/no confirmation, and multiple choice selection. All prompts respect TTY mode and degrade when output is piped.

## Text Prompts

Prompt for a single line of text:

```typescript
run({ io }) {
  const name = await io.prompt('What is your name?')
  io.write(`Hello, ${name}!`)
}
```

The prompt waits for input and returns the entered text.

## Confirmation Prompts

Ask a yes/no question:

```typescript
run({ io }) {
  const confirmed = await io.confirm('Are you sure?')
  if (confirmed) {
    io.write('Proceeding...')
  }
}
```

Returns `true` or `false`.

## Selection Prompts

Offer multiple choices:

```typescript
run({ io }) {
  const choice = await io.select('Choose an option:', [
    'Option A',
    'Option B',
    'Option C'
  ] as const)
  io.write(`You chose: ${choice}`)
}
```

The user selects one option and it's returned.

## Non-Interactive Fallback

When output is not a TTY (piped), prompts:

- For text prompts: Return an empty string
- For confirmations: Return the fallback value (defaults to `false`)
- For selections: Return the first choice

This prevents commands from hanging when run non-interactively.

## Usage in Scripts

Prompts are safe to use even in non-interactive contexts:

```typescript
run({ io }) {
  if (io.isTTY) {
    const response = await io.prompt('Proceed?')
    // handle response
  } else {
    // Skip prompt, use default
  }
}
```

Or rely on automatic fallbacks:

```typescript
// This works in interactive and non-interactive mode
const confirmed = await io.confirm('Continue?', false)
```

## Async Nature

Prompts are async and must be awaited:

```typescript
run({ io }) {
  const input = await io.prompt('Enter value:')
  // Use input here
}
```

## Validation

Validate input by prompting again on failure:

```typescript
run({ io }) {
  let port: number
  while (true) {
    const input = await io.prompt('Enter port:')
    port = parseInt(input, 10)
    if (port > 0 && port < 65536) break
    io.write('Invalid port. Try again.')
  }
}
```

## User Experience

Prompts are interactive only in terminals. In automated environments (CI/CD, scripts), they gracefully fall back to defaults, keeping your CLI usable everywhere.
