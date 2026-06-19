import { describe, test, expect } from 'bun:test'
import { coerceValue } from '@/utils/coerce'

describe('coerceValue', () => {
  describe('with undefined values', () => {
    test('returns undefined unchanged', () => {
      expect(coerceValue(undefined, { type: 'string' })).toBeUndefined()
    })
  })

  describe('with number type', () => {
    test('converts numeric strings to numbers', () => {
      expect(coerceValue('42', { type: 'number' })).toBe(42)
    })

    test('throws on non-numeric input', () => {
      expect(() => coerceValue('nope', { type: 'number' })).toThrow(/Invalid number/)
    })
  })

  describe('with boolean type', () => {
    test('passes booleans through untouched', () => {
      expect(coerceValue(true, { type: 'boolean' })).toBe(true)
      expect(coerceValue(false, { type: 'boolean' })).toBe(false)
    })
  })

  describe('with string type', () => {
    test('passes strings through untouched', () => {
      expect(coerceValue('hello', { type: 'string' })).toBe('hello')
    })
  })
})
