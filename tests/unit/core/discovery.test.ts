import { describe, test, expect } from 'bun:test'
import { join } from 'node:path'
import { discoverManifest } from '@/core/discovery'

const FIXTURES = join(import.meta.dir, 'fixtures', 'commands')

describe('discoverManifest', () => {
  test('finds every command file under the directory', async () => {
    const manifest = await discoverManifest(FIXTURES)
    const routes = manifest.entries.map((e) => e.route.join('/')).sort()
    expect(routes).toEqual(['hello', 'users', 'users/list'])
  })

  test('collapses index.ts into its parent directory route', async () => {
    const manifest = await discoverManifest(FIXTURES)
    const users = manifest.entries.find((e) => e.route.join('/') === 'users')
    expect(users?.sourcePath.endsWith(join('users', 'index.ts'))).toBe(true)
  })

  test('loads the default export as the command module', async () => {
    const manifest = await discoverManifest(FIXTURES)
    const hello = manifest.entries.find((e) => e.route.join('/') === 'hello')
    expect(hello?.meta?.description).toBe('Say hello')
    const loaded = await hello?.importer()
    expect(typeof loaded?.default.run).toBe('function')
  })

  test('produces a manifest usable by the router', async () => {
    const manifest = await discoverManifest(FIXTURES)
    expect(manifest.entries.length).toBe(3)
  })
})
