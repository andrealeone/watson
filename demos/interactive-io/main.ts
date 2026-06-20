import type { Config } from 'cti/src/types/config'
import { discoverManifest } from 'cti/src/core/discovery'
import { run } from 'cti/src/core/runtime'
import { join } from 'node:path'

const config: Config = {
  name: 'interactive-io',
  bin: 'profiles',
  commandsDir: 'commands',
  version: '1.0.0',
}

const commandsDir = join(import.meta.dir, 'commands')
const manifest = await discoverManifest(commandsDir)

process.exit(await run(manifest, config))
