import type { Manifest } from '@/types/manifest'

export interface Config {
  name: string
  version: string
  commandsDir?: string
  targets?: string[]
  bin?: string
  manifest?: Manifest
}
