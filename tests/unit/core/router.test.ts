import { describe, test, expect } from 'bun:test'
import { buildRouteLookup, resolveRoute } from '@/core/router'
import type { Manifest, ManifestEntry } from '@/types/manifest'

function entry(route: string[]): ManifestEntry {
  return {
    route,
    sourcePath: route.join('/') + '.ts',
    importer: () => Promise.resolve({ default: { run: () => {} } }),
  }
}

const manifest: Manifest = {
  entries: [entry(['hello']), entry(['users']), entry(['users', 'list'])],
}

describe('buildRouteLookup', () => {
  test('keys entries by their slash-joined route', () => {
    const lookup = buildRouteLookup(manifest)
    expect(lookup.has('hello')).toBe(true)
    expect(lookup.has('users/list')).toBe(true)
    expect(lookup.size).toBe(3)
  })
})

describe('resolveRoute', () => {
  const lookup = buildRouteLookup(manifest)

  test('resolves a single-segment route', () => {
    const result = resolveRoute(['hello', 'Alice'], lookup)
    expect(result?.entry.route).toEqual(['hello'])
    expect(result?.remaining).toEqual(['Alice'])
  })

  test('prefers the longest matching route prefix', () => {
    const result = resolveRoute(['users', 'list', '--all'], lookup)
    expect(result?.entry.route).toEqual(['users', 'list'])
    expect(result?.remaining).toEqual(['--all'])
  })

  test('falls back to a shorter route when the longer one is unknown', () => {
    const result = resolveRoute(['users', 'create'], lookup)
    expect(result?.entry.route).toEqual(['users'])
    expect(result?.remaining).toEqual(['create'])
  })

  test('returns null when nothing matches', () => {
    expect(resolveRoute(['nope'], lookup)).toBeNull()
  })

  test('returns null for empty args', () => {
    expect(resolveRoute([], lookup)).toBeNull()
  })
})
