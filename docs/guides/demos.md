## Demos

The [`/demos`](../../demos) folder holds small, self-contained example CLIs built
with CTI. They exist to show the **real, runnable API** in context — each demo
is a single readable file you can run, read, copy, and adapt.

### What's there

| Demo             | Demonstrates                                                   |
| ---------------- | -------------------------------------------------------------- |
| `hello-world`    | The minimal command + dispatcher                               |
| `todo-app`       | Multiple commands, positionals, persisted state, exit codes    |
| `deploy-tool`    | Typed flags (`--env`, `--verbose`, `--force`), colour, spinner |
| `api-client`     | Nested routes (`users/list`), environment-driven config        |
| `project-init`   | Flags + filesystem scaffolding from `ctx.cwd`                  |
| `data-transform` | Reading stdin, format conversion (json/csv/table)              |

### The shape of a demo

Every demo defines one or more `CommandModule`s, maps them to routes with
`defineManifest`, and dispatches with `run` (the same runtime an installed CLI
uses). Returning a number from `run` sets the process exit code.

```typescript
import type { CommandModule } from '../../../src/types/command'
import type { Config } from '../../../src/types/config'
import { defineManifest, run } from '../../../src/core/runtime'

const hello: CommandModule = {
  meta: { description: 'Greet someone' },
  run(ctx) {
    ctx.io.write(`Hello, ${ctx.positionals[0] ?? 'World'}!`)
  },
}

const config: Config = { name: 'demo', version: '1.0.0', manifest: defineManifest({ hello }) }
void run(config)
```

> Demos import the framework by **relative path** (`../../../src/...`) because they
> live inside this repository — no install step is needed. In a published project
> you would import from the package instead, and the manifest would be generated
> by scanning your commands directory rather than written inline.

### Running them

From the repo root:

```bash
bun run ./demos/hello-world/main.ts hello Alice
bun run ./demos/api-client/main.ts users get 2
echo '{"name":"Alice"}' | bun run ./demos/data-transform/main.ts format json
```

Or compile any demo to a standalone binary:

```bash
cd demos/hello-world
bun build ./main.ts --compile --outfile dist/hello && ./dist/hello hello Bob
```

### How they stay correct

Every demo is exercised by a single black-box harness in
[`tests/demos`](../../tests/demos), which spawns each CLI and checks its exit code
and key output. If a demo breaks (or a new demo is added without expectations),
the test suite fails. See **[Testing](../contributing/testing.md)** for details.

The demos folder has its own [README](../../demos/README.md) with the full command
list and more examples.
