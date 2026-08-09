import { researchTopics } from "./topics.js";
export const researchQueue = researchTopics.map(topic => ({ topic_id:topic.id, priority:Math.round(topic.importance*topic.uncertainty*topic.momentum/10000), reason:"editorial baseline requires evidence review", created_at:"2026-08-09T00:00:00.000Z", last_run:null, next_run:null, frequency:topic.momentum >= 85 ? "daily" : "weekly" }));
