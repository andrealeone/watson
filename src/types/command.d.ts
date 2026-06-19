import type { Context } from '@/types/context'

export interface FlagSpec {
  type: 'string' | 'boolean' | 'number'
  short?: string
  description?: string
  default?: string | boolean | number
  required?: boolean
  multiple?: boolean
  choices?: readonly string[]
  validate?: (value: unknown) => true | string
}

export interface ArgSpec {
  name: string
  description?: string
  required?: boolean
  variadic?: boolean
  validate?: (value: string) => true | string
}

export interface CommandMeta {
  description?: string
  aliases?: readonly string[]
  hidden?: boolean
  examples?: readonly string[]
}

export interface CommandModule<F = Record<string, unknown>> {
  meta?: CommandMeta
  flags?: Record<string, FlagSpec>
  args?: ArgSpec[]
  run: (ctx: Context<F>) => void | number | Promise<void | number>
}
