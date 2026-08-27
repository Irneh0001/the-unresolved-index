import { researchTopics } from "./topics.js";
export const researchQueue = researchTopics.map(topic => ({ topic_id:topic.id, priority:null, reason:"unassessed editorial baseline requires evidence review", created_at:null, last_run:null, next_run:null, frequency:"weekly", scheduling_basis:"provisional editorial scheduling heuristic; conservative default for unassessed topics" }));
