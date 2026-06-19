import { describe, test, expect, beforeEach, mock } from 'bun:test'
import { defineManifest, run } from '@/core/runtime'
import type { CommandModule } from '@/types/command'
import type { Manifest } from '@/types/manifest'
import type { Config } from '@/types/config'
import type { Context } from '@/types/context'

describe('defineManifest', () => {
  test('converts a flat route map into a Manifest', () => {
    const routes = {
      'hello': { run: () => {} },
      'users/list': { run: () => {} },
    } as Record<string, CommandModule>

    const manifest = defineManifest(routes)

    expect(manifest.entries.length).toBe(2)
    expect(manifest.entries.map((e) => e.route.join('/'))).toContain('hello')
    expect(manifest.entries.map((e) => e.route.join('/'))).toContain('users/list')
  })

  test('splits route keys on slashes', () => {
    const routes = {
      'api/v1/users': { run: () => {} },
    } as Record<string, CommandModule>

    const manifest = defineManifest(routes)
    const entry = manifest.entries[0]

    expect(entry.route).toEqual(['api', 'v1', 'users'])
  })

  test('sets sourcePath from the route key', () => {
    const routes = {
      'admin/settings': { run: () => {} },
    } as Record<string, CommandModule>

    const manifest = defineManifest(routes)
    const entry = manifest.entries[0]

    expect(entry.sourcePath).toBe('admin/settings.ts')
  })

  test('preserves the command module reference', async () => {
    const module: CommandModule = {
      meta: { description: 'Test' },
      run: () => 42,
    }

    const routes = { test: module } as Record<string, CommandModule>
    const manifest = defineManifest(routes)
    const loaded = await manifest.entries[0].importer()

    expect(loaded.default).toBe(module)
  })

  test('includes meta from the command module', () => {
    const module: CommandModule = {
      meta: { description: 'Say hello', aliases: ['hi'] },
      run: () => {},
    }

    const routes = { hello: module } as Record<string, CommandModule>
    const manifest = defineManifest(routes)
    const entry = manifest.entries[0]

    expect(entry.meta?.description).toBe('Say hello')
    expect(entry.meta?.aliases).toEqual(['hi'])
  })

  test('handles empty route map', () => {
    const manifest = defineManifest({})

    expect(manifest.entries.length).toBe(0)
  })

  test('preserves original object when accessing importer', async () => {
    const module: CommandModule = { run: () => {} }
    const routes = { test: module } as Record<string, CommandModule>

    const manifest = defineManifest(routes)
    const loaded1 = await manifest.entries[0].importer()
    const loaded2 = await manifest.entries[0].importer()

    expect(loaded1.default).toBe(loaded2.default)
    expect(loaded1.default).toBe(module)
  })
})

describe('run', () => {
  let _mockIo: any
  let _mockLogger: any
  let config: Config

  beforeEach(() => {
    _mockIo = {
      write: mock(() => {}),
      writeError: mock(() => {}),
      spinner: mock(() => ({})),
    }

    _mockLogger = {
      level: 'info',
      debug: mock(() => {}),
      info: mock(() => {}),
      warn: mock(() => {}),
      error: mock(() => {}),
    }

    config = {
      name: 'test-cli',
      bin: 'test',
      commandsDir: './commands',
      version: '1.0.0',
    }
  })

  function createTestManifest(
    route: string[],
    sourcePath: string,
    runFn: (ctx: Context) => Promise<any>,
  ): Manifest {
    return {
      entries: [
        {
          route,
          sourcePath,
          importer: () => Promise.resolve({ default: { run: runFn } }),
        },
      ],
    }
  }

  function createContextTest(assertion: (ctx: Context) => void): (ctx: Context) => Promise<number> {
    const mockFn = mock((ctx: Context) => {
      assertion(ctx)
      return 0
    })

    return (ctx: Context) => Promise.resolve(mockFn(ctx))
  }

  test('resolves and runs a matched command', async () => {
    const runFn = mock((ctx: Context) => {
      expect(ctx.route).toEqual(['hello'])
      return 0
    })

    const manifest = createTestManifest(['hello'], 'hello.ts', (ctx: Context) => {
      return Promise.resolve(runFn(ctx))
    })

    const result = await run(manifest, config, ['hello'])

    expect(result).toBe(0)
    expect(runFn).toHaveBeenCalled()
  })

  test('returns 1 when command is not found', async () => {
    const manifest: Manifest = { entries: [] }

    const result = await run(manifest, config, ['unknown'])

    expect(result).toBe(1)
  })

  test('returns 1 for empty argv', async () => {
    const manifest: Manifest = { entries: [] }

    const result = await run(manifest, config, [])

    expect(result).toBe(1)
  })

  test('passes parsed flags to the command context', async () => {
    const runFn = mock((ctx: Context) => {
      expect(ctx.flags).toMatchObject({ verbose: true })
      return 0
    })

    const manifest: Manifest = {
      entries: [
        {
          route: ['cmd'],
          sourcePath: 'cmd.ts',
          importer: () =>
            Promise.resolve({
              default: {
                flags: { verbose: { type: 'boolean' } },
                run: runFn,
              },
            }),
        },
      ],
    }

    await run(manifest, config, ['cmd', '--verbose'])
    expect(runFn).toHaveBeenCalled()
  })

  test('passes positional arguments to the command context', async () => {
    const runFn = mock((ctx: Context) => {
      expect(ctx.positionals).toEqual(['arg1', 'arg2'])
      return 0
    })

    const manifest = createTestManifest(['cmd'], 'cmd.ts', (ctx: Context) => {
      return Promise.resolve(runFn(ctx))
    })

    await run(manifest, config, ['cmd', 'arg1', 'arg2'])
    expect(runFn).toHaveBeenCalled()
  })

  test('includes route in context', async () => {
    const manifest = createTestManifest(
      ['users', 'list'],
      'users/list.ts',
      createContextTest((ctx: Context) => {
        expect(ctx.route).toEqual(['users', 'list'])
      }),
    )

    await run(manifest, config, ['users', 'list'])
  })

  test('includes config in context', async () => {
    const manifest = createTestManifest(
      ['cmd'],
      'cmd.ts',
      createContextTest((ctx: Context) => {
        expect(ctx.config).toBe(config)
      }),
    )

    await run(manifest, config, ['cmd'])
  })

  test('includes io and logger in context', async () => {
    const manifest = createTestManifest(
      ['cmd'],
      'cmd.ts',
      createContextTest((ctx: Context) => {
        expect(ctx.io).toBeDefined()
        expect(ctx.logger).toBeDefined()
        expect(ctx.io.write).toBeDefined()
        expect(ctx.logger.info).toBeDefined()
      }),
    )

    await run(manifest, config, ['cmd'])
  })

  test('includes cwd in context', async () => {
    const manifest = createTestManifest(
      ['cmd'],
      'cmd.ts',
      createContextTest((ctx: Context) => {
        expect(typeof ctx.cwd).toBe('string')
        expect(ctx.cwd.length > 0).toBe(true)
      }),
    )

    await run(manifest, config, ['cmd'])
  })

  test('includes environment variables in context', async () => {
    const manifest = createTestManifest(
      ['cmd'],
      'cmd.ts',
      createContextTest((ctx: Context) => {
        expect(ctx.env).toBeDefined()
        expect(typeof ctx.env).toBe('object')
      }),
    )

    await run(manifest, config, ['cmd'])
  })

  test('handles command returning undefined', async () => {
    const manifest: Manifest = {
      entries: [
        {
          route: ['cmd'],
          sourcePath: 'cmd.ts',
          importer: () => Promise.resolve({ default: { run: async () => {} } }),
        },
      ],
    }

    const result = await run(manifest, config, ['cmd'])

    expect(result).toBe(0)
  })

  test('handles command returning a number', async () => {
    const manifest: Manifest = {
      entries: [
        {
          route: ['cmd'],
          sourcePath: 'cmd.ts',
          importer: () =>
            Promise.resolve({ default: { run: (): Promise<number> => Promise.resolve(42) } }),
        },
      ],
    }

    const result = await run(manifest, config, ['cmd'])

    expect(result).toBe(42)
  })

  test('handles command throwing an error', async () => {
    const manifest: Manifest = {
      entries: [
        {
          route: ['cmd'],
          sourcePath: 'cmd.ts',
          importer: () =>
            Promise.resolve({
              default: {
                run: (): Promise<never> => {
                  return Promise.reject(new Error('Command failed'))
                },
              },
            }),
        },
      ],
    }

    const result = await run(manifest, config, ['cmd'])

    expect(result).toBe(1)
  })

  test('handles non-Error thrown values', async () => {
    const manifest: Manifest = {
      entries: [
        {
          route: ['cmd'],
          sourcePath: 'cmd.ts',
          importer: () =>
            Promise.resolve({
              default: {
                run: (): Promise<never> => {
                  return Promise.reject(new Error('string error'))
                },
              },
            }),
        },
      ],
    }

    const result = await run(manifest, config, ['cmd'])

    expect(result).toBe(1)
  })

  test('resolves longest matching route', async () => {
    const listFn = mock((): Promise<number> => Promise.resolve(0))
    const usersFn = mock((): Promise<number> => Promise.resolve(1))

    const manifest: Manifest = {
      entries: [
        {
          route: ['users'],
          sourcePath: 'users.ts',
          importer: () => Promise.resolve({ default: { run: usersFn } }),
        },
        {
          route: ['users', 'list'],
          sourcePath: 'users/list.ts',
          importer: () => Promise.resolve({ default: { run: listFn } }),
        },
      ],
    }

    await run(manifest, config, ['users', 'list', 'filter'])

    expect(listFn).toHaveBeenCalled()
    expect(usersFn).not.toHaveBeenCalled()
  })

  test('passes remaining argv as positionals after route', async () => {
    const runFn = mock((ctx: Context) => {
      expect(ctx.positionals).toEqual(['filter', 'active'])
      return 0
    })

    const manifest = createTestManifest(['users', 'list'], 'users/list.ts', (ctx: Context) => {
      return Promise.resolve(runFn(ctx))
    })

    await run(manifest, config, ['users', 'list', 'filter', 'active'])
    expect(runFn).toHaveBeenCalled()
  })

  test('handles command with no flags defined', async () => {
    const runFn = mock((ctx: Context) => {
      expect(ctx.flags).toBeDefined()
      return 0
    })

    const manifest = createTestManifest(['cmd'], 'cmd.ts', (ctx: Context) => {
      return Promise.resolve(runFn(ctx))
    })

    const result = await run(manifest, config, ['cmd', 'positional', 'arg'])

    expect(result).toBe(0)
    expect(runFn).toHaveBeenCalled()
  })
})
