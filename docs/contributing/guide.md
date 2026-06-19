## Contributing Guide

Watson is still in early development. Contributions are welcome and needed. This guide covers how to contribute.

### Getting Started

#### 1. Clone the Repository

```bash
git clone https://github.com/andrealeone/watson2.git
cd watson2
```

#### 2. Install Dependencies

```bash
bun install
```

#### 3. Run Tests

```bash
bun test
bun test --watch
```

#### 4. Check Types

```bash
bun run check:types
```

#### 5. Format and Lint

```bash
bun run format
bun run lint:fix
```

### Development Workflow

#### Making Changes

1. **Create a branch** from main:

   ```bash
   git checkout -b feature/your-feature
   ```

2. **Write your code** in TypeScript

3. **Test your changes**:

   ```bash
   bun test --watch
   ```

4. **Check types and linting**:

   ```bash
   bun run check:types
   bun run lint
   ```

5. **Commit with a clear message**:

   ```bash
   git commit -m "feat: add new feature"
   ```

6. **Push and open a pull request**:
   ```bash
   git push origin feature/your-feature
   ```

#### Commit Messages

Follow conventional commits:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `test:` — Test additions or fixes
- `refactor:` — Code refactoring (no behaviour change)
- `perf:` — Performance improvement
- `chore:` — Maintenance

Example:

```bash
git commit -m "feat: add command validation"
git commit -m "fix: correct TTY detection on Windows"
git commit -m "docs: update API reference"
```

### Code Style

#### TypeScript

- Use `const` by default, `let` when needed, never `var`
- Prefer explicit types over inference for public APIs
- Use `satisfies` keyword for type narrowing
- Avoid `any`; use `unknown` if the type is truly unknown

#### Naming

- Files: kebab-case (`my-file.ts`)
- Functions and variables: camelCase (`myFunction`)
- Types and interfaces: PascalCase (`MyInterface`)
- Constants: UPPER_SNAKE_CASE (`MAX_SIZE`)

#### Formatting

All code must pass:

```bash
bun run format
```

This uses oxfmt. Don't manually format; let the tool handle it.

#### Linting

All code must pass:

```bash
bun run lint
```

This uses oxlint. Fix warnings before submitting:

```bash
bun run lint:fix
```

### Testing

#### Writing Tests

Tests go in `tests/` with a `.test.ts` extension, mirroring `src/`:

```typescript
// tests/unit/my-feature.test.ts
import { describe, test, expect } from 'bun:test'
import { myFunction } from '../../src/my-function'

describe('myFunction', () => {
  test('does something', () => {
    const result = myFunction()
    expect(result).toBe(expected)
  })

  test('handles edge cases', () => {
    expect(() => myFunction(null)).toThrow()
  })
})
```

#### Running Tests

```bash
bun test              # Run all tests
bun test --watch     # Run in watch mode
bun test my-file     # Run specific test file
```

#### Test Coverage

We aim for >80% coverage. Check coverage:

```bash
bun test --coverage
```

### Documentation

#### Updating Docs

Documentation is in `docs/`. When you change the codebase:

1. **Update relevant architecture docs** if internals change
2. **Update API reference** if public APIs change
3. **Update examples** if usage patterns change

#### Writing Docs

- Use clear, concise language
- Use British English (colour, not color)
- Provide code examples
- Explain the "why" not just the "what"
- Link to related docs with `[title](path)`

Example:

````markdown
## My Topic

This explains something important.

### Usage

```typescript
const x = doSomething()
```
````

This is useful because...

### Why Not Alternative?

We chose this approach because...

````

### Architecture Guidelines

#### Principles

Watson values:

1. **Minimalism** — Include only what's needed
2. **Explicitness** — No magic, no hidden conventions
3. **Composability** — Pieces work together cleanly
4. **Type safety** — Strong types throughout
5. **Performance** — Startup and runtime speed matter

#### When Adding Features

Ask yourself:

- Is this essential for CLI tools? (If no, probably don't add it)
- Can this live outside the core? (Prefer separate modules to core features)
- Does this increase complexity significantly? (Avoid if possible)
- Is there an existing pattern I should follow?

#### Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows the style guide
- [ ] Tests are included and pass
- [ ] Types check: `bun run check:types`
- [ ] Linting passes: `bun run lint`
- [ ] Documentation is updated (if needed)
- [ ] Commit messages are clear
- [ ] No breaking changes (unless major version)

### Reporting Issues

#### Bug Reports

Include:

1. **What you expected** to happen
2. **What actually happened**
3. **Steps to reproduce**
4. **Your environment** (Bun version, OS, etc.)

Example:

```markdown
## Bug: Colours not working in Windows

### Expected
Colours should display in Windows Terminal.

### Actual
All output is plain text, no colours.

### Steps
1. Run `my-cli deploy` in Windows Terminal
2. No colours appear

### Environment
- Bun 1.3.14
- Windows 11
- Windows Terminal
````

#### Feature Requests

Include:

1. **What you want** to do
2. **Why you want** it
3. **How it might** work

Example:

````markdown
## Feature: Command history

### Use Case

I want to see previously run commands.

### Proposal

Add a `history` command that shows recent invocations:

```bash
$ my-cli history
```
````

### Why

This would help users remember what they did.

````

### Getting Help

- **Questions?** Open a discussion or issue
- **Not sure?** Ask before starting big changes
- **Stuck?** Reach out; we're happy to help

### Code of Conduct

Watson is inclusive. We welcome:

- People of all backgrounds
- Beginners and experts
- Different perspectives
- Constructive feedback

We don't tolerate:

- Discrimination
- Harassment
- Bad-faith arguments
- Disrespect

### Reviewing PRs

If you're reviewing a PR:

1. **Check the code** — Does it work? Is it clear?
2. **Check the tests** — Do they cover the change?
3. **Check the docs** — Is it documented?
4. **Be kind** — Offer constructive feedback, not criticism

Example feedback:

```markdown
[Good] Great addition! One suggestion:

The error handling could be clearer. Instead of:
```typescript
if (!value) throw new Error('...')
````

Consider:

```typescript
if (!value) {
  ctx.io.writeError('...')
  return 1
}
```

This gives users a clearer error message. What do you think?

```

### Releasing

Releases are handled by maintainers. The process:

1. Update `package.json` version
2. Update `CHANGELOG.md`
3. Commit and tag: `git tag v1.0.0`
4. Push: `git push origin main --tags`
5. Publish to npm: `npm publish`

Contributors don't need to do this; maintainers handle releases.

---

### Questions?

- Open an issue
- Join discussions
- Reach out directly

Thank you for contributing to Watson!
```
