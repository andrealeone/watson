# Command Routing

CTI routes commands based on the file structure of your `commands` directory. Each file becomes a command, with the directory hierarchy defining the command path.

## How It Works

Commands are discovered through a manifest system that maps routes to command modules. The routing is deterministic and follows a longest-prefix matching strategy.

**File Structure to Route Mapping:**

```
commands/
├── greet.ts           → app greet
├── db/
│   ├── migrate.ts     → app db migrate
│   └── reset.ts       → app db reset
└── remote/
    └── add.ts         → app remote add
```

## Route Resolution

When a user runs a command like `app db migrate`, CTI:

1. Splits the command arguments into route segments and remaining arguments
2. Walks the manifest for the deepest matching entry
3. If no exact match is found, routes to the nearest group help
4. Parses remaining arguments with the matched command's flags

## Nested Commands

Subcommands are created by nesting files in subdirectories. There's no limit to nesting depth:

```
commands/
├── config/
│   ├── get.ts         → app config get
│   ├── set.ts         → app config set
│   └── view/
│       └── all.ts     → app config view all
```

## Command Groups

A directory without a leaf command file acts as a group. Running `app db` without a subcommand prints help for available db subcommands.

## Route Arrays

Internally, routes are represented as string arrays. The file `commands/db/migrate.ts` becomes the route `['db', 'migrate']`, which is available in the context as `ctx.route`.

## Manifest System

In development, routes are discovered at runtime from the file system. When compiled into a binary, CTI uses a pre-generated manifest that maps all routes statically, ensuring identical behavior under `bun run` and in compiled binaries.
