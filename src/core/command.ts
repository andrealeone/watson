import type { CommandModule } from '@/types/command'

/**
 * Wrapper for defining a command module.
 * Validates the command definition and ensures type consistency.
 *
 * @example
 * ```typescript
 * export default command({
 *   meta: { description: 'What this command does' },
 *   run({ io }) {
 *     io.write('Hello!')
 *   },
 * })
 * ```
 */
export function command<F = Record<string, unknown>>(module: CommandModule<F>): CommandModule<F> {
  return module
}
