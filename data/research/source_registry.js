import { sources } from "./sources.js";

const cadenceByDomain = {
  Geopolitics: 6,
  Governance: 24,
  "Law & rights": 24,
  Economy: 72,
  Technology: 24,
  Society: 720
};

export const sourceRegistry = sources.map(source => ({
  ...source,
  enabled: source.enabled ?? true,
  access_method: source.access_method ?? "manual_review",
  feed_url: source.feed_url ?? null,
  cadence_hours: source.cadence_hours ?? cadenceByDomain[source.domains?.[0]] ?? 168,
  last_checked_at: source.last_checked_at ?? null,
  next_check_at: source.next_check_at ?? null
}));

export function dueSources(now = new Date()) {
  const at = now.getTime();
  return sourceRegistry.filter(source => {
    if (!source.enabled) return false;
    if (!source.next_check_at) return true;
    return new Date(source.next_check_at).getTime() <= at;
  });
}

export function nextCheckAt(source, checkedAt = new Date()) {
  return new Date(new Date(checkedAt).getTime() + source.cadence_hours * 3600000).toISOString();
}
