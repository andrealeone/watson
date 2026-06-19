import { isTTY } from '@/utils/tty'
import { colorize } from '@/io/color'
import { createSpinner } from '@/io/spinner'
import { prompt, confirm, select } from '@/io/prompt'
import type { Io, Logger } from '@/types/io'

export function createIo(): Io {
  return {
    isTTY: isTTY(),
    color: colorize,
    write: (text) => {
      process.stdout.write(text + '\n')
    },
    writeError: (text) => {
      process.stderr.write(text + '\n')
    },
    spinner: createSpinner,
    prompt,
    confirm,
    select,
  }
}

export function createLogger(): Logger {
  return {
    level: 'info',
    debug: (...args) => {
      if (process.env.DEBUG) {
        console.log('[DEBUG]', ...args)
      }
    },
    info: (...args) => {
      console.log('[INFO]', ...args)
    },
    warn: (...args) => {
      console.warn('[WARN]', ...args)
    },
    error: (...args) => {
      console.error('[ERROR]', ...args)
    },
  }
}
