/**
 * Helper to safely save and restore environment variables in tests
 */
export function createEnvManager(vars: string[]) {
  const saved = new Map<string, string | undefined>()

  return {
    beforeEach() {
      vars.forEach((key) => {
        saved.set(key, process.env[key])
        delete process.env[key]
      })
    },
    afterEach() {
      saved.forEach((value, key) => {
        if (value === undefined) delete process.env[key]
        else process.env[key] = value
      })
    },
  }
}
