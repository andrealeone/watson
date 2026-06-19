import type { Manifest, ManifestEntry } from '@/types/manifest'

export function buildRouteLookup(manifest: Manifest) {
  const lookup = new Map<string, ManifestEntry>()

  for (const entry of manifest.entries) {
    const routeKey = entry.route.join('/')

    lookup.set(routeKey, entry)
  }

  return lookup
}

export function resolveRoute(
  args: string[],
  lookup: Map<string, ManifestEntry>,
): { entry: ManifestEntry; remaining: string[] } | null {
  for (let i = args.length; i > 0; i--) {
    const routePart = args.slice(0, i),
      routeKey = routePart.join('/'),
      entry = lookup.get(routeKey)

    if (entry)
      return {
        entry,
        remaining: args.slice(i),
      }
  }

  return null
}
