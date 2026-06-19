export function shouldUseColor(): boolean {
  if (process.env.NO_COLOR) return false
  if (process.env.FORCE_COLOR) return true

  return process.stdout.isTTY === true
}

export function isTTY(): boolean {
  return process.stdout.isTTY === true
}
