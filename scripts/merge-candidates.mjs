import { readFile, writeFile } from "node:fs/promises";
import { dedupeCandidates } from "../data/research/candidates.js";

const [discoveredPath = "/tmp/candidates.json", queuePath = "data/research/candidates.generated.json"] = process.argv.slice(2);

export function mergeCandidateQueues({ existing = {}, discovered = {}, reviewedIds = new Set() } = {}) {
  const pending = dedupeCandidates([
    ...(Array.isArray(existing.candidates) ? existing.candidates : []),
    ...(Array.isArray(discovered.candidates) ? discovered.candidates : [])
  ]).filter(candidate => !isReviewed(candidate, reviewedIds));

  return {
    checked_at: discovered.checked_at ?? existing.checked_at ?? new Date().toISOString(),
    sources_checked: Array.isArray(discovered.sources_checked)
      ? discovered.sources_checked
      : (Array.isArray(existing.sources_checked) ? existing.sources_checked : []),
    candidates: pending,
    errors: Array.isArray(discovered.errors) ? discovered.errors : []
  };
}

function isReviewed(candidate, reviewedIds) {
  if (reviewedIds.has(candidate.id)) return true;
  const prefix = `candidate-${candidate.source_id}-${candidate.published_at ?? "undated"}-`;
  for (const id of reviewedIds) if (id.startsWith(prefix)) return true;
  return false;
}

async function readJson(path, fallback) {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function loadReviewedIds() {
  const reviewPath = new URL("../data/research/review-decisions/unresolved-index-review-decisions.json", import.meta.url);
  const review = await readJson(reviewPath, { decisions: {} });
  return new Set(Object.keys(review.decisions ?? {}));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [discovered, existing, reviewedIds] = await Promise.all([
    readJson(discoveredPath, { candidates: [], errors: [] }),
    readJson(queuePath, { candidates: [] }),
    loadReviewedIds()
  ]);
  const merged = mergeCandidateQueues({ existing, discovered, reviewedIds });
  await writeFile(queuePath, JSON.stringify(merged, null, 2) + "\n");
  console.log(`Persisted ${merged.candidates.length} pending candidate(s).`);
}
