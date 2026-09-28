// Candidate updates are discovery output only. They require review before becoming claims, events, or forecast evidence.
export const candidateUpdates = [];

const pertinenceSignals = [
  ["legislation", "legislative or statutory action"],
  ["law", "a law or legal change"],
  ["court", "court or judicial action"],
  ["ruling", "a ruling or adjudication"],
  ["executive order", "executive action"],
  ["sanction", "sanctions or economic pressure"],
  ["ceasefire", "conflict de-escalation"],
  ["war", "armed conflict"],
  ["border", "border or immigration policy"],
  ["tariff", "trade or tariff policy"],
  ["regulation", "regulatory action"],
  ["election", "election administration"],
  ["budget", "public finance"],
  ["debt", "public debt or deficit"],
  ["antitrust", "competition policy"],
  ["grid", "energy or grid policy"],
  ["healthcare", "healthcare policy"],
  ["iran", "Iran-related developments"],
  ["ukraine", "Ukraine-related developments"],
  ["taiwan", "Taiwan-related developments"],
  ["gaza", "Israel-Gaza or regional developments"]
];

export function normalizeCandidate({source_id, topic_id, title, url, published_at=null, summary=""}) {
  const discovered_at = new Date().toISOString();
  const candidate = {
    id: "candidate-" + source_id + "-" + (published_at ?? "undated") + "-" + encodeURIComponent(url).slice(0,32),
    source_id, topic_id, title: String(title ?? "").trim(), url,
    published_at, discovered_at, summary: String(summary ?? "").trim(),
    review_status: "pending", proposed_claims: [], proposed_events: [], proposed_forecast_implications: []
  };
  return {...candidate, automated_review_comment: generateAutomatedReviewComment(candidate, discovered_at)};
}

export function generateAutomatedReviewComment(candidate, generatedAt = candidate.discovered_at) {
  const text = `${candidate.title ?? ""} ${candidate.summary ?? ""}`.toLowerCase();
  const matched = pertinenceSignals.filter(([term]) => text.includes(term)).map(([, label]) => label);
  const basis = [];
  let score = 35;
  if (candidate.topic_id) { score += 20; basis.push(`routed to topic ${candidate.topic_id}`); }
  if (candidate.source_id) { score += 10; basis.push(`discovered through source ${candidate.source_id}`); }
  if (candidate.url) { score += 10; basis.push("source link is available"); }
  if (String(candidate.summary ?? "").trim().length >= 80) { score += 10; basis.push("the feed supplies a substantive excerpt"); }
  if (matched.length) { score += Math.min(15, matched.length * 5); basis.push(`text mentions ${matched.slice(0, 3).join(", ")}`); }
  else { score -= 15; basis.push("no clear policy or conflict signal was detected in the title/excerpt"); }
  score = Math.max(0, Math.min(100, score));
  const assessment = score >= 70 ? "likely_pertinent" : score >= 50 ? "needs_context" : "likely_not_pertinent";
  const assessmentLabel = assessment.replaceAll("_", " ");
  const comment = assessment === "likely_pertinent"
    ? "Automated triage finds a likely connection to the routed topic. Check the source and confirm the specific factual or interpretive relevance before approval."
    : assessment === "needs_context"
      ? "Automated triage finds some possible relevance, but the connection is not strong enough to publish without checking the source and topic context."
      : "Automated triage did not find a strong connection to the routed topic. Check the source manually; reject it if the apparent match is incidental.";
  return { assessment, score, label: assessmentLabel, comment, basis, generated_at: generatedAt, method: "deterministic editorial triage; not an AI or publication decision" };
}

export function withAutomatedReviewComment(candidate, generatedAt = candidate.discovered_at) {
  return candidate.automated_review_comment ? candidate : {
    ...candidate,
    automated_review_comment: generateAutomatedReviewComment(candidate, generatedAt)
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
