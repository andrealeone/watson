import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { shouldUseColor, isTTY } from '@/utils/tty'
import { createEnvManager } from '../../helpers/env'

describe('shouldUseColor', () => {
  const envManager = createEnvManager(['NO_COLOR', 'FORCE_COLOR'])

  beforeEach(() => {
    envManager.beforeEach()
  })

  afterEach(() => {
    envManager.afterEach()
  })

  test('NO_COLOR disables color regardless of FORCE_COLOR', () => {
    process.env.NO_COLOR = '1'
    process.env.FORCE_COLOR = '1'
    expect(shouldUseColor()).toBe(false)
  })

  test('FORCE_COLOR enables color when NO_COLOR is unset', () => {
    process.env.FORCE_COLOR = '1'
    expect(shouldUseColor()).toBe(true)
  })

  test('falls back to the TTY state of stdout', () => {
    expect(shouldUseColor()).toBe(process.stdout.isTTY === true)
  })
})

describe('isTTY', () => {
  test('reflects process.stdout.isTTY', () => {
    expect(isTTY()).toBe(process.stdout.isTTY === true)
  })
})
