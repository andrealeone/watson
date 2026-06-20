import type { Config } from 'cti/src/types/config'
import { run } from 'cti/src/core/runtime'

const config: Config = {
  name: 'api-client',
  bin: 'api',
  version: '1.0.0',
}

process.exit(await run(config, import.meta))
