## Philosophy

### Design Principles

#### Explicit Over Implicit

Watson does not use magic. There are no hidden conventions, auto-discovery mechanisms, or surprise behaviours.

- Commands are registered explicitly: `defineManifest({ name: handler })`
- Configuration is explicit: you build a `Config` object and pass it to `run()`
- Dispatch is explicit: `run(manifest, config)` resolves argv → command

You read Watson code and immediately understand what happens. No searching for decorators or annotation processors.

#### Minimalism by Default

Watson ships with only what CLI tools need. This is a deliberate choice:

- Fewer dependencies = faster startup
- Smaller codebase = easier to understand
- Fewer concepts = shorter learning curve
- Less magic = easier to debug

If you need something Watson doesn't provide, you can add it. But Watson won't bloat itself "just in case."

#### Composition Over Configuration

Watson favours composable primitives over elaborate configuration. Instead of:

```typescript
{
  "commands": [
    { "name": "auth", "subcommands": ["login", "logout"] }
  ]
}
```

You write:

```typescript
const manifest = defineManifest({
  'auth/login': loginCommand,
  'auth/logout': logoutCommand,
})
process.exit(await run(manifest, config))
```

Configuration is code. Code is honest.

#### TypeScript First

Watson assumes TypeScript. Types are not optional; they're central to how the framework works.

- Command handlers are typed: `(ctx: Context) => Promise<void>`
- Flags and arguments are typed: `flags?: Record<string, FlagSpec>`
- The manifest and config are typed: `Manifest`, `Config`

This means you catch mistakes at development time, not production time. Types double as documentation.

#### Performance Isn't Optional

Every design decision considers performance:

- Lazy loading of commands (only imported when invoked)
- Zero-dependency core (uses only Bun and Node's stdlib)
- Minimal allocations in hot paths
- Startup time measured in single digits

Performance isn't a feature you enable later. It's built in from the start.

#### Embrace the Runtime

Watson is built specifically for Bun. It doesn't try to work everywhere or run on Node.js. This lets us:

- Use Bun's native TypeScript support (no transpilation)
- Compile to standalone binaries (Bun's feature, not ours)
- Use Bun's faster syscalls and I/O (meaningful for CLIs)
- Simplify the codebase (no cross-runtime concerns)

Bun is a constraint we embrace, not a limitation we work around.

### How This Shapes Watson

#### Argument Parsing

Watson uses Node.js's built-in `parseArgs` utility, enhanced with type coercion. No external parser, no configuration nightmare. Flags are mapped to TypeScript types.

#### I/O Primitives

Instead of shipping a full-featured terminal UI library, Watson provides:

- `colour(text, 'red')` — Direct ANSI colour output
- `spinner(text)` — Basic loading indication
- `prompt()`, `confirm()`, `select()` — User input primitives

These are thin wrappers around Bun/Node functionality. You can extend them or replace them as needed.

#### Command Structure

A command is not a class or a decorator. It's a module that exports a `CommandModule`:

```typescript
export default {
  meta: { description: 'Deploy application' },
  flags: { environment: { type: 'string', default: 'staging' } },
  run: async (ctx) => {
    /* ... */
  },
} satisfies CommandModule
```

This is clear, typesafe, and immediately understandable.

#### Configuration

Watson doesn't enforce a configuration format. Load YAML, JSON, TypeScript modules—whatever suits you. Configuration is just data. Type it how you like.

---

### Where Watson Differs

#### vs. Yargs/Commander.js

Those libraries are mature and widely used, but they:

- Predate Bun by years (API design shows it)
- Support Node.js (adds complexity)
- Have larger surface area (more to learn)

Watson is Bun-native, smaller, and assumes TypeScript.

#### vs. Oclif

Oclif is feature-rich and production-tested. It's designed for large CLI suites. Watson is smaller, faster, and opinionated in different ways.

Oclif uses classes and a plugin framework. Watson uses plain command modules and a small dispatcher.

#### vs. Deno's Fresh (hypothetically)

If Deno had a CLI framework, it would likely be similar to Watson—minimal, TypeScript-first, runtime-native. We got there first with Bun.

---

### What Watson Isn't

Watson is not:

- **A web framework.** Use Hono, Elysia, or others for servers.
- **A general-purpose application framework.** It's for CLIs specifically.
- **A task runner.** It's not Makefile, Rake, or npm scripts.
- **A package manager.** It doesn't manage dependencies.
- **A terminal UI framework.** It provides primitives, not a full component system.

Watson is a CLI framework. We do that one thing exceptionally well.
