import { run } from 'cti'
import type { Config } from 'cti'

const config: Config = {
  name: 'todo-app',
  bin: 'todo',
  version: '1.0.0',
}

void run(config, import.meta)
