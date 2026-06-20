## Contributing to CTI

Welcome. If you're reading this, you're probably thinking about helping CTI grow. Thank you.

### What We're Building

CTI is a Bun-native CLI framework that challenges a simple assumption: _building CLIs shouldn't be hard._

Right now, CLI frameworks are borrowed from the web development world. They're built for servers—persistent, always-on, network-heavy workloads. But CLIs are different. They run once and exit. They care about startup time in milliseconds. They distribute as single binaries, not npm packages.

CTI is built for CLIs. Not servers, not libraries, not data pipelines. Just CLIs. And we're trying to make them fast, small, and a pleasure to build.

If you believe that's worth doing, you're in the right place.

### Why Contribute?

#### You Build CLIs

You know the pain. Every framework you've tried feels borrowed, over-engineered, slow. You want something lightweight and TypeScript-native that actually respects your time. **Contributing to CTI means building the tool you wish existed.** And you get to shape it from the ground up.

#### You Care About Simplicity

You believe less code is better code. You hate framework magic. You think conventions are overrated. **CTI needs people who push back on complexity.** Every feature request will be challenged: "Is this essential? Can it live outside the core? Does it slow startup?"

#### You Want to Shape It Early

CTI hasn't been released yet, so nothing is set in stone. **Contributing now means shaping the tool before its conventions harden.** Feedback on the design—what's missing, what's awkward—lands while it can still change everything.

#### You're Learning

You want to understand how modern CLI frameworks work. Or you're building your first open-source contribution. Or you're exploring TypeScript, Bun, or systems design. **CTI's codebase is small and readable.** It's designed to be understandable in an afternoon. Contributing is a great way to learn.

#### You Have Ideas

Maybe you don't code, but you have ideas. Or you write great documentation. Or you find bugs. Or you want to design the next feature. **Contribution isn't just code.** Issues, discussions, documentation, examples, and design input all matter.

### How You Can Help

#### [Documentation]

- Improve existing docs (clarity, examples, British English)
- Write new guides for common patterns
- Create tutorials or video walkthroughs
- Improve the API reference with clearer examples

**Start here:** [Contributing Guide: Documentation](contributing/guide.md#updating-docs)

#### [Core Features]

- Implement planned features from the [roadmap](future/roadmap.md)
- Fix bugs in router, parser, or I/O system
- Optimise startup time or binary size
- Improve error messages

**Start here:** [Roadmap](future/roadmap.md) + [Architecture Docs](architecture/system-design.md)

#### [Testing & Quality]

- Write tests for existing code (improve coverage)
- Test CTI on different platforms (Windows, Linux, macOS)
- Test on different terminal emulators
- Find and report edge cases

**Start here:** [Contributing Guide: Testing](contributing/guide.md#testing)

#### [Examples & Demos]

- Build real-world CLIs with CTI
- Create example projects showcasing patterns
- Write blog posts or tutorials
- Share your CTI projects

**Start here:** [Examples](guides/examples.md)

#### [Feedback]

- Provide feedback on designs and APIs
- Test pre-release builds
- Share use cases and what's missing
- Report confusing errors or rough edges

**Start here:** Open a discussion or issue on GitHub

#### [Performance]

- Profile startup time and binary size
- Find and fix bottlenecks
- Benchmark against alternatives
- Optimise I/O operations

**Start here:** [Architecture: Core Module](architecture/core.md)

### Getting Familiar with CTI

Before diving into code, understand what you're building:

#### The 30-Minute Orientation

1. **[Vision](principles/vision.md)** (5 min) — Why CTI exists
2. **[Philosophy](principles/philosophy.md)** (5 min) — Design principles
3. **[Quick Start](getting-started/quickstart.md)** (10 min) — Try it yourself
4. **[Roadmap](future/roadmap.md)** (10 min) — Where it's going

This takes half an hour and gives you the full context.

#### The Deep Dive (If You're Contributing Code)

1. **[Core Concepts](concepts/core-concepts.md)** — The mental model
2. **[System Design](architecture/system-design.md)** — How pieces fit together
3. **[The specific module docs](architecture/)** — Whatever you're touching
4. **[Contributing Guide](contributing/guide.md)** — Development workflow

This takes 2–3 hours and prepares you to contribute meaningfully.

### Where We Need Help Most

CTI is Phase 0. The foundation is solid; the ecosystem is nascent. Here's where help accelerates us:

#### Immediate (This Quarter)

- **Testing** — Find bugs and platform issues
- **Documentation** — Make existing docs better
- **Examples** — Show what CTI can do
- **Feedback** — Tell us what's missing

#### Phase 1 (Q3–Q4 2026)

- **Flag validation** — enforce `choices` / `validate` in the parser
- **`--help` / `--version`** — generated from `meta` and `Config`
- **Friendlier errors** — "did you mean?" on unknown commands
- **Shell completions** — bash, zsh, fish support

See [Roadmap](future/roadmap.md) for details.

### Your First Contribution

#### Option 1: Low Barrier (Documentation, Examples, Discussion)

1. Read the [Quick Start](getting-started/quickstart.md)
2. Build a small CLI with CTI
3. Open an issue with what confused you or what you learned
4. Or: Improve the docs based on your experience
5. Or: Share your CLI as an example

**No setup needed. Just ideas and writing.**

#### Option 2: Testing & Feedback

1. Clone the repo
2. Follow [Contributing Guide: Installation](contributing/guide.md#getting-started)
3. Run CTI locally
4. Test on your platform
5. Report issues: bugs, platform problems, confusing errors
6. Suggest improvements

**Minimal setup. Maximum impact.**

#### Option 3: Code Contribution

1. Read [Core Concepts](concepts/core-concepts.md)
2. Follow [Contributing Guide: Development Workflow](contributing/guide.md#development-workflow)
3. Pick an issue or feature from the [roadmap](future/roadmap.md)
4. Code, test, get feedback
5. Submit a PR

**Full setup. Deep involvement.**

### Getting Set Up

Once you've decided to contribute code, follow the [Contributing Guide](contributing/guide.md). It covers:

- How to clone and install
- Running tests and linting
- Code style and conventions
- Commit message format
- PR process
- Getting help if you get stuck

**Start there:** [Contributing Guide](contributing/guide.md)

### Philosophy of Contribution

A few things to know about how CTI is run:

#### We Optimise for Simplicity

Every feature is questioned. Does this justify the complexity? Can it live outside the core? Does it slow startup? If you're proposing something, be prepared to justify it against simplicity.

That's not gatekeeping; it's protection. CTI's value is that it's small and understandable. We keep it that way.

#### We Value Stability

APIs are stable within major versions. If you're fixing a bug or adding a feature, it won't break existing users. If a change requires a breaking change, we'll bump the major version.

Stability means people can build tools on CTI without fear.

#### We Listen to Users

Ideas come from real problems, not imagination. If 100 developers ask for feature X, we consider it. If one person thinks it's cool, we probably won't add it (unless they're right and we just haven't realised it yet).

Use CTI. Tell us what's missing. That's the best contribution.

#### We Move Deliberately

CTI isn't in a race. We're building something that will last. That means:

- Not rushing features
- Thinking through design carefully
- Testing thoroughly
- Documenting completely

If something takes longer than expected, that's okay.

### Questions?

Don't know where to start? Confused about something? Want to discuss an idea?

**Open a discussion on GitHub.** Seriously. The best way to get involved is to show up and ask.

Or read the [Core Concepts](concepts/core-concepts.md) and come back. Nothing here requires you to already know everything.

### Code of Conduct

CTI is for everyone. We welcome:

- People of all backgrounds
- Beginners and experts equally
- Different perspectives and approaches
- Constructive feedback and ideas

We don't tolerate:

- Discrimination or harassment
- Bad-faith arguments
- Disrespect or condescension
- Anything that makes CTI unwelcoming

If you see something, say something. We'll take it seriously.

### What Happens Next?

1. **Read the 30-minute orientation** — Get context
2. **Clone the repo** and follow [Contributing Guide setup](contributing/guide.md#getting-started)
3. **Pick something to work on** — A doc improvement, a test, a bug, an idea
4. **Start small** — Your first contribution doesn't need to be big
5. **Talk to us** — Ask questions, get feedback, iterate
6. **Submit a PR** — We'll review thoughtfully and help you land it

That's it. You're in.

---

### Further Reading

- **[Vision](principles/vision.md)** — Why CTI exists
- **[Roadmap](future/roadmap.md)** — What's coming
- **[Contributing Guide](contributing/guide.md)** — The mechanics
- **[Core Concepts](concepts/core-concepts.md)** — How CTI works
- **[Philosophy](principles/philosophy.md)** — Why things are designed this way

---

### A Personal Note

Building CTI alone would be slow and lonely. Every person who shows up—whether to code, test, discuss, or just use CTI and report what's missing—makes this real.

We're building something small and thoughtful in a world of bloated frameworks. That's hard. But it's also exactly why we need your help.

Thank you for considering it. Let's build something together.

— Andrea and the CTI team

---

**Ready to start?** Read [Core Concepts](concepts/core-concepts.md), then open an issue or discussion on GitHub. We'll take it from there.
