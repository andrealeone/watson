<h1 align="center">Watson</h1>

Watson is a Bun-native TypeScript framework for building command-line tools. Install it as a dependency, call it once from your entrypoint, and start writing command files. Watson discovers them, parses their arguments, routes to them, and renders their output.

<br/>

### Vision

Installing a CLI framework should feel like installing Next.js, not like copying a starter kit. You install Watson, write an entrypoint that's one line long, drop files into a `commands` directory, and you have a working, typed, compilable CLI. Everything between the argument vector and your handler is Watson's job, not yours.

There are no configuration files to maintain and no wiring code to write. The name nods to the steady second who does the legwork while the lead supplies intent: the framework handles the plumbing, and the developer writes only what each command does.

<br/>

### Features

- **No Boilerplate**  No manual imports or routing logic, just files in a `commands` directory.
- **Typed Arguments**  Flags and positionals are declared once and arrive in your handler already parsed, coerced, and typed.
- **Zero-Config**:  Watson reads your `package.json` and discovers commands from the filesystem; nothing to wire up by hand.
- **Bun-Optimised**  Lean on Bun's speed and native TypeScript, with no runtime dependencies.
- **Compiles to Binary**  Ship your CLI as a single standalone executable with `bun build --compile`.

<br/><br/>

## Getting Started

Requires [Bun](https://bun.sh) 1.3 or later.

```bash
mkdir new-cli && cd new-cli

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

const manifest = defineManifest({ hello }),
  config: Config = {
    name: 'new-cli',
    bin: 'new-cli',
    commandsDir: 'commands',
    version: '1.0.0',
  }

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

<br/><br/>

## Documentation

The example above is just a taste. Watson has comprehensive documentation covering everything from first steps to advanced patterns. Here's where to go:

### Getting up to speed

**New to Watson?**  
Start with the [Quick Start guide](docs/getting-started/quickstart.md) for a five-minute tour, or read [Core Concepts](docs/concepts/core-concepts.md) to understand the mental model.

**Ready to build something?**  
Head to [Building Commands](docs/guides/building-commands.md) for practical patterns, browse [Examples](docs/guides/examples.md) for real-world snippets, or run the [runnable demos](docs/guides/demos.md) in [`/demos`](demos) to see Watson in action.

### Deep dives

**Understanding the design**  
Explore [System Overview](docs/architecture/system-design.md) to see how the pieces fit together, then dive into specific modules: [Core](docs/architecture/core.md) (routing and argument parsing), [I/O System](docs/architecture/io.md) (colours, prompts, spinners), [Type System](docs/architecture/types.md) (strong typing), and [Utilities](docs/architecture/utils.md).

**Why these choices?**  
[Value Proposition](docs/principles/value-proposition.md) explains what makes Watson worth your time, and [Philosophy](docs/principles/philosophy.md) compares it to other frameworks.

**Contributing & roadmap**  
[Contribution Guide](docs/contributing/guide.md) covers the development workflow, [Testing](docs/contributing/testing.md) explains the test structure, and [Roadmap](docs/future/roadmap.md) shows where Watson is heading.

**Full reference**  
See the [API Reference](docs/reference/api-reference.md) for type definitions and exports.

<br/>
