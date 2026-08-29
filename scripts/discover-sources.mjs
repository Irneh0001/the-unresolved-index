import { dueSources, nextCheckAt, matchesSourceFilter } from "../data/research/source_registry.js";
import { dedupeCandidates, normalizeCandidate } from "../data/research/candidates.js";

export async function discover({ now = new Date(), fetchImpl = fetch } = {}) {
  const due = dueSources(now).filter(source => source.feed_url);
  const candidates = [];
  const errors = [];
  for (const source of due) {
    try {
      const response = await fetchImpl(source.feed_url, { headers: { accept: "application/rss+xml, application/atom+xml, text/xml" } });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const xml = await response.text();
      for (const item of parseFeed(xml)) {
        if (matchesSourceFilter(source, item)) candidates.push(normalizeCandidate({ source_id: source.id, topic_id: source.topic_id, ...item }));
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
