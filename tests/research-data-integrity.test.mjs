import test from "node:test";
import assert from "node:assert/strict";
import { researchTopics } from "../data/research/topics.js";
import { claims } from "../data/research/claims.js";
import { sources } from "../data/research/sources.js";
import { events } from "../data/research/events.js";
import { forecasts } from "../data/research/forecasts.js";
import { positions } from "../data/research/positions.js";
import { consequences } from "../data/research/consequences.js";

const collections = { researchTopics, claims, sources, events, forecasts, positions, consequences };

test("research data imports cleanly for page rendering", () => {
  for (const [name, rows] of Object.entries(collections)) {
    assert.ok(Array.isArray(rows), name + " must be an array");
    assert.equal(rows.some(row => row == null), false, name + " contains a null/undefined record");
    const ids = rows.map(row => row.id);
    assert.equal(new Set(ids).size, ids.length, name + " contains duplicate IDs");
  }
  const topicIds = new Set(researchTopics.map(topic => topic.id));
  for (const row of [...claims, ...events, ...positions, ...forecasts, ...consequences]) {
    assert.ok(topicIds.has(row.topic_id), row.id + " references an unknown topic");
  }
});
