import type { CommandModule, CommandMeta } from '@/types/command'

export interface ManifestEntry {
  route: string[]
  sourcePath: string
  importer: () => Promise<{ default: CommandModule }>
  meta?: CommandMeta
}

export interface Manifest {
  entries: ManifestEntry[]
}
