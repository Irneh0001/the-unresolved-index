import test from "node:test";
import assert from "node:assert/strict";
import { applyReviewRequest, parseReviewRequest } from "../scripts/apply-approved-candidates.mjs";

const candidate = {
  id: "candidate-src-test-2026-09-28-example",
  source_id: "src-test",
  topic_id: "ai-governance",
  title: "Regulatory update",
  url: "https://example.test/update",
  published_at: "Mon, 28 Sep 2026 12:00:00 +0000",
  summary: "A source-reported policy update.",
  review_status: "pending"
};

test("approved candidates become source and event records and leave the queue", () => {
  const result = applyReviewRequest({
    body: `<!-- unresolved-index-review:v1
{"decisions":{"candidate-src-test-2026-09-28-example":"approved"}}
-->`,
    queue: {candidates: [candidate]},
    reviewLedger: {decisions: {}},
    now: new Date("2026-09-28T13:00:00Z")
  });
  assert.equal(result.applied.length, 1);
  assert.equal(result.updates[0].source.url, candidate.url);
  assert.equal(result.updates[0].event.topic_id, candidate.topic_id);
  assert.equal(result.queue.candidates.length, 0);
  assert.equal(result.reviewLedger.decisions[candidate.id], "approved");
});

test("rejected candidates leave no published update but are removed from the queue", () => {
  const result = applyReviewRequest({
    body: `<!-- unresolved-index-review:v1
{"decisions":{"candidate-src-test-2026-09-28-example":"rejected"}}
-->`,
    queue: {candidates: [candidate]},
    reviewLedger: {decisions: {}}
  });
  assert.equal(result.applied.length, 0);
  assert.equal(result.updates.length, 0);
  assert.equal(result.queue.candidates.length, 0);
  assert.equal(result.reviewLedger.decisions[candidate.id], "rejected");
});

test("malformed review requests are rejected", () => {
  assert.throws(() => parseReviewRequest("not a review request"), /marker not found/);
});
