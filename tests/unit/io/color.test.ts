import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { colorize } from '@/io/color'

describe('colorize', () => {
  let saved: Record<string, string | undefined>

  beforeEach(() => {
    saved = { NO_COLOR: process.env.NO_COLOR, FORCE_COLOR: process.env.FORCE_COLOR }
  })

  afterEach(() => {
    for (const key of ['NO_COLOR', 'FORCE_COLOR']) {
      if (saved[key] === undefined) delete process.env[key]
      else process.env[key] = saved[key]
    }
  })

  test('wraps text in ANSI codes when color is enabled', () => {
    delete process.env.NO_COLOR
    process.env.FORCE_COLOR = '1'
    const out = colorize('hi', 'green')
    expect(out).toBe('\x1b[32mhi\x1b[0m')
  })

  test('returns text unchanged when color is disabled', () => {
    process.env.NO_COLOR = '1'
    expect(colorize('hi', 'red')).toBe('hi')
  })
})
