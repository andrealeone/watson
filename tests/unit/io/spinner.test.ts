import { describe, test, expect } from 'bun:test'
import { createSpinner } from '@/io/spinner'

// createSpinner is currently a no-op handle. These tests assert its shape and
// that every method is safely callable, which is the contract consumers rely on.
describe('createSpinner (stub)', () => {
  test('returns a handle exposing the full SpinnerHandle surface', () => {
    const handle = createSpinner('working')
    expect(typeof handle.update).toBe('function')
    expect(typeof handle.succeed).toBe('function')
    expect(typeof handle.fail).toBe('function')
    expect(typeof handle.stop).toBe('function')
  })

  test('methods are no-ops that do not throw', () => {
    const handle = createSpinner('working')
    expect(() => {
      handle.update('still working')
      handle.succeed('done')
      handle.fail('nope')
      handle.stop()
    }).not.toThrow()
  })
})
