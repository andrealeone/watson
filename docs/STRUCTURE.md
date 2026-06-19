## Documentation Structure

Watson's documentation is organized into eight logical clusters, each with a specific purpose.

### Overview of Clusters

#### 1. **Principles** (`/principles/`)

Why Watson exists and what makes it different.

- **vision.md** — The problem Watson solves and the future it's building toward
- **value-proposition.md** — Why you should choose Watson over alternatives
- **philosophy.md** — Design principles and how they shape Watson

**For:** Decision makers, architects, people evaluating Watson

**Read if:** You're deciding whether Watson is right for your project

---

#### 2. **Getting Started** (`/getting-started/`)

From zero to first working CLI.

- **quickstart.md** — Five minutes from nothing to your first command

**For:** Developers new to Watson

**Read if:** You want to start building immediately

---

#### 3. **Concepts** (`/concepts/`)

The mental model behind Watson.

- **core-concepts.md** — Commands, context, routing, flags, configuration—the key ideas

**For:** Anyone learning Watson

**Read if:** You want to understand how Watson works

---

#### 4. **Architecture** (`/architecture/`)

Deep dives into each module and how they work.

- **system-design.md** — Overview of Watson's layered architecture
- **core.md** — Runtime dispatcher, router, and argument parsing (`src/core/`)
- **io.md** — Terminal interaction, colours, prompts (`src/io/`)
- **types.md** — Type system and contracts (`src/types/`)
- **utils.md** — Utilities: coercion, TTY detection (`src/utils/`)

**For:** Contributors, architects, developers building on Watson's internals

**Read if:** You want to understand how Watson is built or extend it deeply

---

#### 5. **Guides** (`/guides/`)

Practical patterns for building with Watson.

- **building-commands.md** — How to write excellent commands with best practices
- **demos.md** — Example CLIs demonstrating Watson features (runnable, copy-and-adapt)
- **examples.md** — Real-world usage patterns and code snippets

**For:** Developers building CLIs with Watson

**Read if:** You're writing commands or learning from examples

---

#### 6. **Reference** (`/reference/`)

Complete API documentation.

- **api-reference.md** — All types, interfaces, and exported functions

**For:** Developers looking up specific APIs

**Read if:** You need exact type signatures or function details

---

#### 7. **Contributing** (`/contributing/`)

How to help improve Watson.

- **guide.md** — Development workflow, code style, reporting issues
- **testing.md** — Three test layers (unit, e2e, demos), running tests, validation strategy

**For:** Contributors and maintainers

**Read if:** You want to contribute to Watson's development or understand the test structure

---

#### 8. **Future** (`/future/`)

Where Watson is heading.

- **roadmap.md** — Phases of development, planned features, and decision-making philosophy

**For:** Users who want to know what's coming

**Read if:** You want to understand Watson's future direction

---

### Reading Paths

#### Path 1: "I'm Evaluating Watson"

1. **[Vision](principles/vision.md)** — Understand the problem and opportunity
2. **[Value Proposition](principles/value-proposition.md)** — Why Watson, not alternatives?
3. **[Quick Start](getting-started/quickstart.md)** — Try it out
4. **[Roadmap](future/roadmap.md)** — Where is this going?

**Time:** ~30 minutes

---

#### Path 2: "I'm Building a CLI"

1. **[Quick Start](getting-started/quickstart.md)** — Get something working
2. **[Core Concepts](concepts/core-concepts.md)** — Understand the model
3. **[Building Commands](guides/building-commands.md)** — Write great commands
4. **[Examples](guides/examples.md)** — See real patterns
5. **[API Reference](reference/api-reference.md)** — Look up specifics

**Time:** ~2 hours (reading) + hands-on coding

---

#### Path 3: "I'm Contributing to Watson"

1. **[Philosophy](principles/philosophy.md)** — Understand design principles
2. **[System Design](architecture/system-design.md)** — Overall architecture
3. **All Architecture Docs** — Deep dive into each module
4. **[Contributing Guide](contributing/guide.md)** — Development workflow

**Time:** ~3-4 hours

---

#### Path 4: "I'm Using Watson's APIs"

1. **[Core Concepts](concepts/core-concepts.md)** — Understand the model
2. **[API Reference](reference/api-reference.md)** — Exact signatures
3. **[Relevant Architecture](architecture/)** — Deep understanding of specific modules

**Time:** ~1-2 hours

---

### Quick Links

| Goal                         | Document                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| Decide whether to use Watson | [Vision](principles/vision.md) + [Value Proposition](principles/value-proposition.md) |
| Build your first command     | [Quick Start](getting-started/quickstart.md)                                          |
| Understand Watson            | [Core Concepts](concepts/core-concepts.md)                                            |
| Write better commands        | [Building Commands](guides/building-commands.md)                                      |
| See working examples         | [Demos](guides/demos.md) + [Examples](guides/examples.md)                             |
| Look up a type               | [API Reference](reference/api-reference.md)                                           |
| Understand how Watson works  | [System Design](architecture/system-design.md)                                        |
| Understand testing           | [Testing Guide](contributing/testing.md)                                              |
| Contribute to Watson         | [Contributing Guide](contributing/guide.md)                                           |
| See what's coming            | [Roadmap](future/roadmap.md)                                                          |

---

### Document Conventions

#### Code Examples

Examples show realistic usage:

```typescript
// Real, runnable code
export default {
  run: async (ctx) => {
    /* ... */
  },
} satisfies CommandModule
```

#### Cross-References

Documents link to related content:

- **Inline links** like [this](core-concepts.md) point to related docs
- **"See also"** sections at the end suggest next reading

#### British English

All documentation uses British English conventions (colour, not color; optimise, not optimize).

#### Design Rationale

Architectural decisions explain the "why":

- **Why this approach?** — The problem it solves
- **Why not alternatives?** — Trade-offs considered
- **Future evolution** — How it might change

---

### Documentation Maintenance

Watson's docs are living. As the framework evolves:

- Architecture docs are updated when internals change
- API docs stay in sync with code
- Examples are kept current
- Roadmap evolves with development

Check the `git log` for `docs/` to see what changed recently.

---

### Tips for Reading

1. **Start at the top** — The main [README](../README.md) is the hub
2. **Follow your path** — Pick a reading path above; don't jump around
3. **Skim first** — Get the big picture before diving into details
4. **Code as you read** — Type examples; don't just read them
5. **Link-hop** — Follow "See also" links when curious

---

Happy reading. Welcome to Watson.
