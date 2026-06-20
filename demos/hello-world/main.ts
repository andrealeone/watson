import type { Config } from 'cti/src/types/config'
import { command } from 'cti/src/core/command'
import { defineManifest, run } from 'cti/src/core/runtime'

const hello = command({
  meta: { description: 'Greet someone' },
  run(ctx) {
    const name = ctx.positionals[0] ?? 'World'
    ctx.io.write(`Hello, ${name}!`)
  },
})

const goodbye = command({
  meta: { description: 'Say goodbye to someone' },
  run(ctx) {
    const name = ctx.positionals[0] ?? 'World'
    ctx.io.write(`Goodbye, ${name}!`)
  },
})

const config: Config = {
  name: 'hello-world',
  bin: 'hello',
  version: '1.0.0',
  manifest: defineManifest({ hello, goodbye }),
}

void run(config)
