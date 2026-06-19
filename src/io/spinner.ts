import type { SpinnerHandle } from '@/types/io'

export function createSpinner(_text: string): SpinnerHandle {
  return {
    update: () => {},
    succeed: () => {},
    fail: () => {},
    stop: () => {},
  }
}
