import { run } from 'cti'
import type { Config } from 'cti'

const config: Config = {
  name: 'interactive-io',
  bin: 'profiles',
  version: '1.0.0',
}

void run(config, import.meta)
