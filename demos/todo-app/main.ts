import type { Config } from 'cti/src/types/config'
import { run } from 'cti/src/core/runtime'
import { discoverManifest } from 'cti/src/core/discovery'
import { join } from 'node:path'

const commandsDir = join(import.meta.dir, 'commands')

const manifest = await discoverManifest(commandsDir)

const config: Config = {
  name: 'todo-app',
  bin: 'todo',
  commandsDir: 'commands',
  version: '1.0.0',
}

process.exit(await run(manifest, config))
