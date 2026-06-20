# Manifest Definition

`defineManifest` builds a manifest by hand from an in-memory map of routes to command modules, instead of scanning a `commands` directory. It's the inline counterpart to [discovery](manifest-system.md), useful for small CLIs or anywhere you'd rather see every command listed in one place than spread across files.

## Basic Usage

```typescript
import { command } from 'cti'
import { defineManifest, run } from 'cti'

const hello = command({
  meta: { description: 'Greet someone' },
  run(ctx) {
    const name = ctx.positionals[0] ?? 'World'
    ctx.io.write(`Hello, ${name}!`)
  },
})

const manifest = defineManifest({ hello })

process.exit(await run(manifest, config))
```

The keys of the object passed to `defineManifest` become routes, and the values are the command modules themselves — no filesystem, no `commandsDir` walk.

## Nested Routes

Keys are slash-delimited, matching the same route format the router uses everywhere else:

```typescript
const manifest = defineManifest({
  hello,
  'users/list': listUsers,
  'users/get': getUser,
})
```

`'users/list'` becomes the route `['users', 'list']`, invoked as `app users list`. This is the same longest-prefix matching described in [Command Routing](command-routing.md) — `defineManifest` only changes where the entries come from, not how they're routed.

## When to Use It

- Small CLIs where a handful of commands fit comfortably in one file
- Demos, tests, and examples where avoiding extra files keeps things readable
- Cases where commands are generated or composed in code rather than authored as files

For CLIs with many commands, prefer `discoverManifest` over a `commands` directory — see [Manifest System](manifest-system.md). Both produce the same `Manifest` shape, so the router, help system, and compiled-binary behavior are identical regardless of which one you choose.

## Relationship to discoverManifest

`defineManifest` and `discoverManifest` are interchangeable inputs to `run`. Swapping one for the other never requires changing command modules, the router, or the `Config` — only how the manifest's entries are produced changes.
