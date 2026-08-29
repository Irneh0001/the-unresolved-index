import { sources } from "./sources.js";
import { claims } from "./claims.js";

const topicByClaim = new Map(claims.map(claim => [claim.id, claim.topic_id]));

const feedOverrides = {
  "src-ftc-ai-comply": "https://www.ftc.gov/feeds/press-release.xml",
  "src-big-tech-anchor": "https://www.ftc.gov/feeds/press-release-competition.xml",
  "src-energy-grid-anchor": "https://www.eia.gov/rss/press_rss.xml",
  "src-fertility-anchor": "https://www.census.gov/newsroom/press-releases/by-year.xml",
  "src-iran-un-ceasefire-20260615": "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
};

const feedFilters = {
  "src-ftc-ai-comply": ["ai-powered", "artificial intelligence", "machine learning", "automated decision", "algorithmic"],
  "src-big-tech-anchor": ["digital advertising", "semiconductor", "software", "cloud", "technology platform", "social media", "search engine", "online platform"],
  "src-law-enforcement-independence-anchor": ["justice department", "fbi", "inspector general", "law enforcement", "prosecut", "oversight", "misconduct", "independence"],
  "src-energy-grid-anchor": ["electricity", "grid", "power", "natural gas", "energy outlook", "data center"],
  "src-fertility-anchor": ["population", "birth", "fertility", "demographic", "migration"],
  "src-tariffs-trade-anchor": ["tariff", "trade", "export", "import", "customs", "commerce", "agreement"],
  "src-iran-un-ceasefire-20260615": ["iran", "nuclear", "hormuz", "ceasefire", "sanctions", "iaea", "conflict", "negotiation"]
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
  next_check_at: source.next_check_at ?? null,
  filter_keywords: feedFilters[source.id] ?? null
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

export function matchesSourceFilter(source, item) {
  const keywords = source.filter_keywords;
  if (!keywords?.length) return true;
  const text = String(item.title ?? "").toLowerCase();
  return keywords.some(keyword => text.includes(keyword));
}
