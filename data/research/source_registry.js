import { sources } from "./sources.js";
import { claims } from "./claims.js";

const topicByClaim = new Map(claims.map(claim => [claim.id, claim.topic_id]));

const feedOverrides = {
  "src-ftc-ai-comply": "https://www.ftc.gov/feeds/press-release.xml",
  "src-big-tech-anchor": "https://www.ftc.gov/feeds/press-release-competition.xml",
  "src-epstein-accountability-anchor": "https://www.justice.gov/news/rss?field_component=376&require_all=0&search_api_language=en&show_public_archived=0&type%5B0%5D=image_gallery&type%5B1%5D=press_release&type%5B2%5D=speech&type%5B3%5D=youtube_video",
  "src-law-enforcement-independence-anchor": "https://www.justice.gov/news/rss?field_component=376&require_all=0&search_api_language=en&show_public_archived=0&type%5B0%5D=image_gallery&type%5B1%5D=press_release&type%5B2%5D=speech&type%5B3%5D=youtube_video",
  "src-energy-grid-anchor": "https://www.eia.gov/rss/press_rss.xml",
  "src-fertility-anchor": "https://www.census.gov/newsroom/press-releases/by-year.xml",
  "src-tariffs-trade-anchor": "https://ustr.gov/archive/Meta_Content/RSS/ustr_press_releases_10475.xml"
};

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
  topic_id: source.topic_id ?? source.supports_claims.map(id => topicByClaim.get(id)).find(Boolean) ?? null,
  enabled: source.enabled ?? true,
  access_method: source.access_method ?? "manual_review",
  feed_url: source.feed_url ?? feedOverrides[source.id] ?? null,
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
