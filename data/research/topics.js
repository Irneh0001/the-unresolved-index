import { topics as mvpTopics } from "../topics.js";

const questions = {
  "border-immigration":"What durable legal and operational framework should govern enforcement, asylum, detention, removal, and lawful immigration?",
  "birthright-citizenship":"What stable authoritative interpretation governs citizenship at birth in the United States?",
  "federal-debt":"What credible long-term fiscal path can stabilize or improve debt sustainability?",
  "social-security":"What durable policy path can maintain Social Security solvency and benefit commitments?"
};
const mechanisms = { "border-immigration":"legislation and sustained administrative implementation", "birthright-citizenship":"authoritative judicial interpretation and institutional acceptance", "federal-debt":"legislation and durable fiscal implementation", "social-security":"legislation and durable financing reform" };

// Baseline migration only. These records intentionally contain no externally sourced factual claims.
export const researchTopics = mvpTopics.map(topic => ({
  id: topic.id, country: "United States", country_id: topic.countryId, domain: topic.domain, title: topic.title,
  question: questions[topic.id] ?? `What durable, authoritative outcome would settle the core question represented by “${topic.title}”?`,
  summary: "Editorial baseline. Research evidence, claims, and published forecasts have not yet been added.",
  status: "deeply_unresolved", definition_of_resolved: topic.definitionOfResolved,
  importance: topic.priority, uncertainty: topic.signals.unresolved, institutional_disagreement: Math.min(100, Math.round((topic.priority + topic.signals.unresolved) / 2)), momentum: topic.signals.likelyChange,
  decision_incompleteness: 85, resolution_mechanism: mechanisms[topic.id] ?? "authoritative decision plus durable implementation", stakeholders: [], subtopics: [topic.subtopic], key_questions: [],
  claims: [], events: [], forecasts: [], sources: [], last_assessed: null, next_review: null,
  assessment_history: [{ id:`${topic.id}-assessment-baseline`, assessed_at:"2026-08-09", kind:"editorial_baseline", dimensions:{ importance:topic.priority, substantive_uncertainty:topic.signals.unresolved, institutional_disagreement:Math.min(100,Math.round((topic.priority+topic.signals.unresolved)/2)), decision_incompleteness:85, momentum:topic.signals.likelyChange }, rationale:"Initial editorial baseline; not the product of automated research." }],
  forecast_history: [], editorial_baseline: true
}));
