import { dueSources, nextCheckAt, matchesSourceFilter } from "../data/research/source_registry.js";
import { dedupeCandidates, normalizeCandidate } from "../data/research/candidates.js";
import { sources } from "../data/research/sources.js";
import { readFile } from "node:fs/promises";

export async function discover({ now = new Date(), fetchImpl = fetch } = {}) {
  const due = dueSources(now).filter(source => source.feed_url);
  const candidates = [];
  const publishedUrls = new Set(sources.map(source => source.url).filter(Boolean).map(url => canonicalUrl(url)));
  const reviewed = await loadReviewedDecisions();
  const errors = [];
  for (const source of due) {
    try {
      const response = await fetchImpl(source.feed_url, { headers: { accept: "application/rss+xml, application/atom+xml, text/xml" } });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const xml = await response.text();
      for (const item of parseFeed(xml)) {
        if (matchesSourceFilter(source, item)) {
          const normalizedItem = { ...item, url: canonicalUrl(item.url, source.feed_url) };
          const candidate = normalizeCandidate({ source_id: source.id, topic_id: source.topic_id, ...normalizedItem });
          const legacyPrefix = `candidate-${candidate.source_id}-${candidate.published_at || "undated"}-`;
          if (!publishedUrls.has(normalizedItem.url) && !reviewed.has(candidate.id) && ![...reviewed].some(id => id.startsWith(legacyPrefix))) candidates.push(candidate);
        }
      }
    } catch (error) {
      errors.push({ source_id: source.id, error: String(error.message ?? error), checked_at: now.toISOString(), next_check_at: nextCheckAt(source, now) });
    }
  }
  return { checked_at: now.toISOString(), sources_checked: due.map(s => s.id), candidates: dedupeCandidates(candidates), errors };
}

function parseFeed(xml) {
  const items = [...xml.matchAll(/<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)>/gi)].map(match => match[0]);
  return items.map(item => ({
    title: text(item, "title"),
    url: text(item, "link") || (item.match(/<link[^>]+href=["']([^"']+)/i)?.[1] ?? ""),
    published_at: text(item, "pubDate") || text(item, "published") || text(item, "updated"),
    summary: text(item, "description") || text(item, "summary") || ""
  })).filter(item => item.title && item.url);
}

function text(xml, tag) {
  const pattern = "<" + tag + "[^>]*>([\\s\\S]*?)</" + tag + ">";
  return xml.match(new RegExp(pattern, "i"))?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim() ?? "";
}

function canonicalUrl(url, base) {
  try { return new URL(url, base).href; } catch { return String(url ?? ""); }
}

async function loadReviewedDecisions() {
  try {
    const file = await readFile(new URL("../data/research/review-decisions/unresolved-index-review-decisions.json", import.meta.url), "utf8");
    return new Set(Object.keys(JSON.parse(file).decisions || {}));
  } catch { return new Set(); }
}
