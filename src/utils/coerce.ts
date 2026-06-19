import type { FlagSpec } from '@/types/command'

export function coerceValue(value: unknown, spec: FlagSpec): unknown {
  if (value === undefined) return undefined

  if (spec.type === 'boolean') return value
  if (spec.type === 'number') {
    const num = Number(value)

    if (Number.isNaN(num)) throw new Error(`Invalid number: ${JSON.stringify(value)}`)

    return num
  }

  return value
}
