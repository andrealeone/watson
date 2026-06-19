# Watson

Watson is a Bun-native TypeScript framework for building command-line tools. Install it as a dependency, call it once from your entrypoint, and start writing command files — Watson discovers them, parses their arguments, routes to them, and renders their output.

## Vision

Installing a CLI framework should feel like installing Next.js, not like copying a starter kit. You install Watson, write an entrypoint that's one line long, drop files into a `commands` directory, and you have a working, typed, compilable CLI. Everything between the argument vector and your handler is Watson's job, not yours.

There are no configuration files to maintain and no wiring code to write. The name nods to the steady second who does the legwork while the lead supplies intent: the framework handles the plumbing, and the developer writes only what each command does.

## Features

- **No boilerplate** — no manual imports or routing logic, just files in a `commands` directory.
- **Typed arguments** — flags and positionals are declared once and arrive in your handler already parsed, coerced, and typed.
- **Zero-config by convention** — Watson reads your `package.json` and discovers commands from the filesystem; nothing to wire up by hand.
- **Bun-optimised** — leans on Bun's speed and native TypeScript, with no runtime dependencies.
- **Compiles to a binary** — ship your CLI as a single standalone executable with `bun build --compile`.

## Getting Started

Requires [Bun](https://bun.sh) 1.3.14 or later.

```bash
mkdir my-cli && cd my-cli
bun init -y
bun install
```

Create `src/cli.ts`:

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

Run it:

```bash
bun run ./src/cli.ts hello Alice
# Output: Hello, Alice!
```

Compile it to a standalone binary:

```bash
bun build ./src/cli.ts --compile --outfile dist/my-cli
./dist/my-cli hello Alice
```

## Documentation

This is just a taste. For the full picture — concepts, architecture, guides, principles, and the roadmap — see [`/docs`](docs/README.md).
