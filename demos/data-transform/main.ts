import type { Config } from 'cti/src/types/config'
import { run } from 'cti/src/core/runtime'

const config: Config = {
  name: 'data-transform',
  bin: 'transform',
  version: '1.0.0',
}

void run(config, import.meta)
