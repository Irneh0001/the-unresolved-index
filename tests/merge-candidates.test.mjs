import test from "node:test";
import assert from "node:assert/strict";
import { mergeCandidateQueues } from "../scripts/merge-candidates.mjs";
import { generateAutomatedReviewComment, normalizeCandidate } from "../data/research/candidates.js";

const candidate = (id, url) => ({
  id, source_id: "src-test", topic_id: "topic-test", title: id,
  url, published_at: "2026-09-26T00:00:00Z", review_status: "pending"
});

test("retains pending candidates when the next feed snapshot is empty", () => {
  const existing = candidate("candidate-existing", "https://example.test/existing");
  const merged = mergeCandidateQueues({
    existing: { candidates: [existing] },
    discovered: { checked_at: "2026-09-26T01:00:00Z", sources_checked: ["src-test"], candidates: [], errors: [] }
  });
  assert.equal(merged.candidates[0].id, existing.id);
  assert.equal(merged.candidates.length, 1);
  assert.equal(merged.candidates[0].automated_review_comment.assessment, "needs_context");
});

test("deduplicates newly rediscovered candidates and removes reviewed candidates", () => {
  const existing = candidate("candidate-existing", "https://example.test/item");
  const rediscovered = { ...existing, title: "newer title" };
  const reviewed = candidate("candidate-reviewed", "https://example.test/reviewed");
  const merged = mergeCandidateQueues({
    existing: { candidates: [existing, reviewed] },
    discovered: { candidates: [rediscovered], errors: [] },
    reviewedIds: new Set([reviewed.id])
  });
  assert.equal(merged.candidates.length, 1);
  assert.equal(merged.candidates[0].id, existing.id);
});

test("new discoveries receive a pre-review pertinence assessment", () => {
  const discovered = normalizeCandidate({
    source_id: "src-iran", topic_id: "iran-war-end-state",
    title: "Ceasefire negotiations continue", url: "https://example.test/iran",
    summary: "Officials discussed a possible ceasefire and sanctions policy."
  });
  const assessment = generateAutomatedReviewComment(discovered, "2026-09-28T00:00:00.000Z");
  assert.equal(assessment.assessment, "likely_pertinent");
  assert.match(assessment.comment, /Automated triage/);
  assert.equal(assessment.method, "deterministic editorial triage; not an AI or publication decision");
});
