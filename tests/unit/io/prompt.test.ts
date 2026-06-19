import { describe, test, expect } from 'bun:test'
import { prompt, confirm, select } from '@/io/prompt'

// NOTE: prompt/confirm/select are currently non-interactive stubs in src/io/prompt.ts.
// These tests pin their documented stub behaviour so a future real implementation
// is a deliberate, test-visible change rather than a silent one.
describe('prompt (stub)', () => {
  test('resolves to an empty string', async () => {
    expect(await prompt('Name?')).toBe('')
  })
})

describe('confirm (stub)', () => {
  test('defaults to false when no fallback is given', async () => {
    expect(await confirm('Sure?')).toBe(false)
  })

  test('returns the provided fallback', async () => {
    expect(await confirm('Sure?', true)).toBe(true)
  })
})

describe('select (stub)', () => {
  test('returns the first choice', async () => {
    expect(await select('Pick', ['a', 'b', 'c'])).toBe('a')
  })
})
