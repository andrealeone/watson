import { command } from '@/core/command'
import { DATA, baseUrl, emit } from '../../src/utils'

export default command({
  meta: { description: 'List posts' },
  run(ctx) {
    ctx.io.write(`Fetching ${baseUrl(ctx)}/posts`)
    emit(ctx, DATA.posts)
  },
})
