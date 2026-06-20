import type { CommandModule } from '@/types/command'
import type { Config } from '@/types/config'
import { defineManifest, run } from '@/core/runtime'

const ping: CommandModule = {
  meta: { description: 'Ping the server' },
  run(ctx) {
    ctx.io.write('pong')
  },
}

const users: CommandModule = {
  meta: { description: 'User command (incomplete)' },
  run(ctx) {
    ctx.io.writeError('users command incomplete')
    return 1
  },
}

const usersList: CommandModule = {
  meta: { description: 'List users' },
  flags: {
    count: { type: 'number', short: 'c', description: 'Number of users', default: 10 },
  },
  run(ctx) {
    const count = (ctx.flags as { count?: number }).count ?? 10
    ctx.io.write(`Listing ${count} users`)
  },
}

const manifest = defineManifest({
  ping,
  users,
  'users/list': usersList,
})

const config: Config = {
  name: 'cti',
  commandsDir: 'commands',
  version: '1.0.0',
}

process.exit(await run(manifest, config))
