## Quick Start

### Install Bun

CTI requires Bun 1.3.14 or later. Install it from [bun.sh](https://bun.sh).

```bash
curl -fsSL https://bun.sh/install | bash
```

### Create a CTI Project

```bash
mkdir my-cli && cd my-cli
bun init -y
```

### Install CTI

CTI is still in early development. For now, clone or copy the CTI source:

```bash
bun install
```

(In a released version, this would be `bun add cti-cli`.)

### Your First Command

Create `main.ts`. A command is a `CommandModule`; you map commands to routes with `defineManifest`, then dispatch with `run`:

```typescript
import type { CommandModule } from './types/command'
import type { Config } from './types/config'
import { defineManifest, run } from './core/runtime'

const hello: CommandModule = {
  meta: { description: 'Greet someone' },
  run(ctx) {
    const name = ctx.positionals[0] ?? 'World'
    ctx.io.write(`Hello, ${name}!`)
  },
}

const manifest = defineManifest({ hello })
const config: Config = { name: 'my-cli', bin: 'my-cli', commandsDir: 'commands', version: '1.0.0' }
process.exit(await run(manifest, config))
```

### Run It

```bash
bun run ./main.ts hello Alice
# Output: Hello, Alice!
```

### Add Flags

Declare flags on the command; `run` parses and coerces them into `ctx.flags`:

```typescript
const hello: CommandModule = {
  meta: { description: 'Greet someone' },
  flags: {
    formal: { type: 'boolean', short: 'f', description: 'Use a formal greeting' },
  },
  run(ctx) {
    const name = ctx.positionals[0] ?? 'World'
    const greeting = ctx.flags.formal ? 'Greetings' : 'Hello'
    ctx.io.write(`${greeting}, ${name}!`)
  },
}
```

Run it:

```bash
bun run ./main.ts hello Alice --formal
# Output: Greetings, Alice!
```

### Compile to Binary

Create a standalone executable:

```bash
bun build ./main.ts --compile --outfile dist/my-cli
./dist/my-cli hello Bob
# Output: Hello, Bob!
```

Done. You have a compiled, standalone CLI that runs instantly.

### Next Steps

- **[Core Concepts](../concepts/core-concepts.md)** — Understand commands, context, and routing
- **[Building Commands](../guides/building-commands.md)** — Patterns and best practices
- **[Examples](../guides/examples.md)** — More real-world usage
- **[Architecture](../architecture/system-design.md)** — How CTI works under the hood

---

**That's really it.** Five minutes from nothing to a working CLI. Everything else is just TypeScript.
