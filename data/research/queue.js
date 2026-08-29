import { researchTopics } from "./topics.js";
import { consequences } from "./consequences.js";

const cadenceByDomain = { Geopolitics: 6, Governance: 24, "Law & rights": 24, Economy: 72, Technology: 24, Society: 720 };

export function priorityFor(topic) { const risk=consequences.find(c=>c.topic_id===topic.id)?.risk_score; return [topic.importance,topic.uncertainty,topic.momentum,risk].every(Number.isFinite) ? Math.round(topic.importance*.25+topic.uncertainty*.2+topic.momentum*.15+risk*.4) : null; }

export const researchQueue = researchTopics.map(topic => {
  const cadenceHours = cadenceByDomain[topic.domain] ?? (topic.assessment_status === "unassessed" ? 168 : 24);
  return {
    topic_id: topic.id,
    priority: priorityFor(topic),
    reason: topic.assessment_status === "researched" ? "reviewed evidence baseline" : "unassessed editorial baseline requires evidence review",
    created_at: null,
    last_run: null,
    next_run: null,
    frequency: cadenceHours <= 6 ? "every_6_hours" : cadenceHours <= 24 ? "daily" : cadenceHours <= 168 ? "weekly" : "monthly",
    cadence_hours: cadenceHours,
    scheduling_basis: "domain-aware provisional cadence; geopolitical topics are checked every six hours, while slow-moving social topics are checked monthly"
  };
});
