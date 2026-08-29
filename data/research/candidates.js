// Candidate updates are discovery output only. They require review before becoming claims, events, or forecast evidence.
export const candidateUpdates = [];

export function normalizeCandidate({source_id, topic_id, title, url, published_at=null, summary=""}) {
  return {
    id: "candidate-" + source_id + "-" + (published_at ?? "undated") + "-" + encodeURIComponent(url).slice(0,32),
    source_id, topic_id, title: String(title ?? "").trim(), url,
    published_at, discovered_at: new Date().toISOString(), summary: String(summary ?? "").trim(),
    review_status: "pending", proposed_claims: [], proposed_events: [], proposed_forecast_implications: []
  };
}

export function dedupeCandidates(rows) {
  const seen = new Set();
  return rows.filter(row => {
    const key = row.url ? normalizeUrl(row.url) : [row.source_id,row.title,row.published_at].join("|");
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";
    return parsed.href;
  } catch {
    return String(url).trim().replace(/\/+$/, "");
  }
}
