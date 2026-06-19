import { parseArgs } from 'node:util'

import { coerceValue } from '@/utils/coerce'
import type { FlagSpec } from '@/types/command'

interface ParseArgsOption {
  type: 'boolean' | 'string'
  short?: string
  multiple?: boolean
  default?: string | boolean
}

export function toParseArgsOptions(flags: Record<string, FlagSpec>) {
  const options: Record<string, ParseArgsOption> = {}

  for (const [name, spec] of Object.entries(flags)) {
    const option: ParseArgsOption = {
      type: spec.type === 'boolean' ? 'boolean' : 'string',
    }

    if (spec.short !== undefined) option.short = spec.short
    if (spec.multiple !== undefined) option.multiple = spec.multiple
    if (spec.default !== undefined) {
      // parseArgs only accepts string/boolean defaults; a numeric default is
      // stringified here and coerced back to a number in parseAndCoerce.
      option.default = typeof spec.default === 'number' ? String(spec.default) : spec.default
    }

    options[name] = option
  }

  return options
}

export function parseAndCoerce(args: string[], flags: Record<string, FlagSpec>) {
  const options = toParseArgsOptions(flags),
    result = parseArgs({
      args,
      options,
      tokens: true,
      allowPositionals: true,
    })

  const coerced: Record<string, unknown> = {}

  for (const [name, spec] of Object.entries(flags)) {
    const value = result.values[name]

    if (value === undefined) {
      if (spec.default !== undefined) coerced[name] = spec.default
      continue
    }

    coerced[name] = coerceValue(value, spec)
  }

  return {
    values: coerced,
    positionals: result.positionals,
  }
}
