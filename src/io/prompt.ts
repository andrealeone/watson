export function prompt(_question: string): Promise<string> {
  return Promise.resolve('')
}

export function confirm(_question: string, fallback?: boolean): Promise<boolean> {
  return Promise.resolve(fallback ?? false)
}

export function select<T extends string>(_question: string, _choices: readonly T[]): Promise<T> {
  return Promise.resolve(_choices[0])
}
