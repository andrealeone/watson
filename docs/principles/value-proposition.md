## Value Proposition

### Why Choose CTI?

#### Performance First

**Startup speed matters.** A user invoking your CLI shouldn't feel friction. CTI's baseline is 1–10ms, depending on hardware. Most of that is Bun's initialisation; your code adds almost nothing.

Compare to Node.js frameworks, which start in 300–500ms before your first command executes. Multiply that by 20 invocations across a developer's day, and you've lost half an hour.

With CTI, it's fast from day one. No optimisation needed. The framework gets out of the way.

**Binary size matters.** A standalone CTI CLI weighs 10–50MB depending on what you include. A Node.js CLI weighs 100–300MB before dependencies. Distribution is easier, installation is faster, end-user friction is lower.

#### TypeScript Without Compromise

You get full type safety:

- **Command types.** Arguments, flags, and context are fully typed. Mistakes are caught at dev time, not on a user's machine.
- **Configuration types.** Define your config shape once; TypeScript enforces it everywhere.

No build step. No configuration files. Edit a `.ts` file, run `bun run`, and your code executes immediately. Feedback is instant.

#### Designed for CLIs

CTI wasn't adapted from something else. Every design choice reflects the reality of CLI development:

**Commands are first-class.** Each command is a module. You register it, you understand it, you control it. No implicit routing, no hidden conventions.

**I/O is straightforward.** Colours, prompts, spinners—the things CLI tools actually use—are built in and trivial to use. No hunting through npm for a spinner library that doesn't quite work.

**Arguments matter.** Parsing and coercion are handled cleanly. Flags, positionals, validation—all integrated, all typed.

**Sharing is just modules.** Share command logic across tools by importing it. A command is a plain object; nothing magic. You understand it in seconds.

#### Minimal Surface Area

CTI includes what CLI tools need and nothing more:

- Routing and command dispatch
- Argument and flag parsing with type coercion
- I/O primitives (colour, prompts, spinners)
- Environment and configuration access via context

We don't include:

- ORMs or database abstractions (use whatever you want; CTI won't get in the way)
- Web frameworks or middleware (not a CLI concern)
- Logging frameworks (we provide basic logging; extend it as needed)
- Package managers or dependency resolution (use Node modules or Bun's dependencies)

This minimalism is intentional. A smaller surface area means:

- Faster learning curve
- Easier to maintain
- Fewer things to break
- Clearer mental model

#### Standalone Binaries

CTI compiles to executables that work anywhere:

```bash
bun build ./src/cli.ts --compile --outfile dist/my-cli
./dist/my-cli
```

That's it. A single binary. No Node.js installation required. No npm. No `node_modules`. Users run your CLI the same way they run any other command-line tool.

#### Composability

CTI commands are plain modules. That means you can:

- Share command logic across multiple CLI tools by importing it
- Compose commands into a manifest with `defineManifest`
- Keep each command independently testable

There's no bespoke extension system to learn—just TypeScript modules and a dispatcher.

---

### Choose CTI If

- You're building a CLI tool (not a server, not a library)
- You want fast startup and small binaries
- You value TypeScript and type safety
- You want to write code, not configure tooling
- You're distributing a standalone executable
- You care about your users' experience

### You Might Not Choose CTI If

- You're building a server (use a framework like Hono or Elysia)
- You need runtime-only solutions (CTI is Bun-only)
- You want to target Node.js exclusively (though Bun runs on many platforms)
- You need extensive built-in middleware or an extension framework (CTI is intentionally minimal)

CTI isn't trying to be everything. It's trying to be the best choice for one thing: fast, lean, standalone CLI applications.
