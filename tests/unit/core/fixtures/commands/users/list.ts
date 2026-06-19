import type { CommandModule } from '@/types/command'

const usersList: CommandModule = {
  meta: { description: 'List users' },
  run(ctx) {
    ctx.io.write('users list')
  },
}

export default usersList
