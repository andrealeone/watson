## CTI CLI Documentation

A complete guide to CTI—a Bun-native TypeScript CLI framework built on the belief that CLI development should be straightforward, not laborious.

### Start Here

**New to CTI?**

- **[Vision & Philosophy](principles/vision.md)** — Why CTI exists and what we're building
- **[Quick Start](getting-started/quickstart.md)** — Five minutes from nothing to your first command
- **[Core Concepts](concepts/core-concepts.md)** — The mental model behind CTI

**Convinced? Ready to build?**

- **[Building Commands](guides/building-commands.md)** — Practical patterns and best practices
- **[Examples](guides/examples.md)** — Real-world usage snippets
- **[Demos](guides/demos.md)** — Runnable example CLIs in [`/demos`](../demos) you can read, run, and adapt
- **[API Reference](reference/api-reference.md)** — Type definitions and exports

### Understanding CTI

Deep dives into how CTI is designed and why:

**Architecture & Design**

- **[System Overview](architecture/system-design.md)** — How the pieces fit together
- **[Core Module](architecture/core.md)** — Router and argument parsing
- **[I/O System](architecture/io.md)** — Colours, prompts, spinners, and terminal integration
- **[Type System](architecture/types.md)** — Strong typing for commands and configuration
- **[Utilities](architecture/utils.md)** — Helper functions (coercion, TTY detection)

**Why These Choices?**

- **[Value Proposition](principles/value-proposition.md)** — What makes CTI worth your time
- **[Comparison & Trade-offs](principles/philosophy.md)** — How CTI differs from other frameworks

### Contributing

- **[Contribution Guide](contributing/guide.md)** — Development workflow, testing, code style
- **[Testing](contributing/testing.md)** — How [`/tests`](../tests) is structured (unit, e2e, demos) and how to run it
- **[Roadmap](future/roadmap.md)** — Where CTI is heading

---

**CTI is built on [Bun](https://bun.sh) and TypeScript.** It compiles to standalone binaries with zero runtime overhead. Everything in these docs reflects that reality.
