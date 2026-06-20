import { run } from 'cti/src/core/runtime'
import type { Config } from 'cti/src/types/config'

const config: Config = {
  name: 'api-client',
  version: '1.0.0',
}

void run(config, import.meta)
