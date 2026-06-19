import type { CommandModule } from '@/types/command'

const hello: CommandModule = {
  meta: { description: 'Say hello' },
  run(ctx) {
    ctx.io.write('hello')
  },
}

export default hello
