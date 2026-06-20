import { run } from 'cti'
import type { Config } from 'cti'

const config: Config = {
  name: 'data-transform',
  bin: 'transform',
  version: '1.0.0',
}

void run(config, import.meta)
