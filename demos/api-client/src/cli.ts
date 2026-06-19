import type { Config } from '@/types/config'
import { run } from '@/core/runtime'
import { discoverManifest } from '@/core/discovery'
import { join } from 'node:path'

const commandsDir = join(import.meta.dir, '..', 'commands')

const manifest = await discoverManifest(commandsDir)

const config: Config = {
  name: 'api-client',
  bin: 'api',
  commandsDir: 'commands',
  version: '1.0.0',
}

process.exit(await run(manifest, config))
