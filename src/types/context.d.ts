import type { Config } from '@/types/config'
import type { Io, Logger } from '@/types/io'

export interface Context<F = Record<string, unknown>> {
  flags: F
  positionals: string[]
  route: string[]
  cwd: string
  env: Record<string, string | undefined>
  config: Config
  io: Io
  logger: Logger
}
