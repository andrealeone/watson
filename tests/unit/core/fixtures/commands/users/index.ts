import type { CommandModule } from '@/types/command'

const users: CommandModule = {
  meta: { description: 'User commands' },
  run(ctx) {
    ctx.io.write('users')
  },
}

export default users
