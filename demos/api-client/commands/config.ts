import { command } from 'cti/src/core/command'
import { baseUrl } from '../lib/utils'

export default command({
  meta: { description: 'Show the resolved API configuration' },
  run(ctx) {
    const key = ctx.env.API_KEY ?? 'demo-key'
    ctx.io.write('\nAPI Configuration:')
    ctx.io.write(`  Base URL: ${baseUrl(ctx)}`)
    ctx.io.write(`  API Key:  ${key.slice(0, 6)}...`)
  },
})
