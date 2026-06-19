import type { Color } from '@/types/io'
import { shouldUseColor } from '@/utils/tty'

const ANSI_COLORS: Record<Color, string> = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

const ANSI_RESET = '\x1b[0m'

export function colorize(text: string, color: Color): string {
  if (!shouldUseColor()) return text
  return `${ANSI_COLORS[color]}${text}${ANSI_RESET}`
}
