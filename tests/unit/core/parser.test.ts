import { describe, test, expect } from 'bun:test'
import { toParseArgsOptions, parseAndCoerce } from '@/core/parser'
import type { FlagSpec } from '@/types/command'

describe('toParseArgsOptions', () => {
  describe('type conversion', () => {
    test('maps boolean flags to boolean options', () => {
      const opts = toParseArgsOptions({ verbose: { type: 'boolean' } })
      expect(opts.verbose).toMatchObject({ type: 'boolean' })
    })

    test('maps number flags to string options (parseArgs has no number type)', () => {
      const opts = toParseArgsOptions({ count: { type: 'number' } })
      expect(opts.count).toMatchObject({ type: 'string' })
    })
  })

  describe('optional properties', () => {
    test('forwards short, multiple, and default', () => {
      const flags: Record<string, FlagSpec> = {
        tag: { type: 'string', short: 't', multiple: true, default: 'x' },
      }
      const opts = toParseArgsOptions(flags)
      expect(opts.tag).toMatchObject({ short: 't', multiple: true, default: 'x' })
    })

    test('omits optional fields when absent', () => {
      const opts = toParseArgsOptions({ name: { type: 'string' } })
      expect(opts.name).toEqual({ type: 'string' })
    })
  })
})

describe('parseAndCoerce', () => {
  describe('parsing', () => {
    test('separates positionals from flags', () => {
      const { positionals, values } = parseAndCoerce(['build', '--verbose', 'target'], {
        verbose: { type: 'boolean' },
      })
      expect(positionals).toEqual(['build', 'target'])
      expect(values.verbose).toBe(true)
    })
  })

  describe('coercion', () => {
    test('coerces number flags to numbers', () => {
      const { values } = parseAndCoerce(['--count', '5'], {
        count: { type: 'number' },
      })
      expect(values.count).toBe(5)
    })

    test('throws on a non-numeric value for a number flag', () => {
      expect(() => parseAndCoerce(['--count', 'abc'], { count: { type: 'number' } })).toThrow(
        /Invalid number/,
      )
    })
  })

  describe('defaults', () => {
    test('applies defaults when a flag is omitted', () => {
      const { values } = parseAndCoerce([], {
        env: { type: 'string', default: 'staging' },
      })
      expect(values.env).toBe('staging')
    })

    test('omits flags that are neither provided nor defaulted', () => {
      const { values } = parseAndCoerce([], { name: { type: 'string' } })
      expect('name' in values).toBe(false)
    })
  })
})
