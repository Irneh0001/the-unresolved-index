import { topics } from "./topics.js";
export const forecasts = topics.map(topic => ({ id:`${topic.id}-baseline`, topicId:topic.id, asOf:"2026-08-09", horizon:"Not yet published", status:"editorial-baseline", scenario:"No forecast published. A forecast requires dated scenarios, confidence, rationale, and supporting evidence.", confidence:null, supersedes:null }));
