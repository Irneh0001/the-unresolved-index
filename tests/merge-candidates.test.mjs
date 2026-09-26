import test from "node:test";
import assert from "node:assert/strict";
import { mergeCandidateQueues } from "../scripts/merge-candidates.mjs";

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
  assert.deepEqual(merged.candidates, [existing]);
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
