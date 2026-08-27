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
  status: null, assessment_status: "unassessed", definition_of_resolved: topic.definitionOfResolved,
  importance: topic.priority, uncertainty: null, institutional_disagreement: null, momentum: topic.signals.likelyChange,
  decision_incompleteness: null, resolution_mechanism: mechanisms[topic.id] ?? "authoritative decision plus durable implementation", stakeholders: [], subtopics: [topic.subtopic], key_questions: [],
  claims: [], events: [], forecasts: [], sources: [], last_assessed: null, next_review: null,
  assessment_history: [{ id:`${topic.id}-assessment-baseline`, assessed_at:null, kind:"editorial_baseline", assessment_status:"unassessed", dimensions:{ importance:topic.priority, substantive_uncertainty:null, institutional_disagreement:null, decision_incompleteness:null, momentum:topic.signals.likelyChange }, rationale:"Editorial metadata only; no evidence-based unresolved-state assessment has been made." }],
  forecast_history: [], editorial_baseline: true
}));

const pilotEvidence = {
 "border-immigration": { assessment_status:"provisional", status:"active", claims:["clm-border-cbp-data","clm-border-gao-report"], events:["evt-cbp-published-stats","evt-gao-immigration-report"], sources:["src-cbp-stats","src-gao-immigration-enforcement"], last_assessed:"2026-08-27", next_review:"2026-09-03", rationale:"CBP operational data and an independent GAO audit were reviewed; this supports a provisional evidence baseline, not a complete system assessment." },
 "federal-debt": { assessment_status:"provisional", status:"active", claims:["clm-debt-cbo-baseline","clm-debt-treasury-definition"], events:["evt-cbo-baseline","evt-treasury-debt-data"], sources:["src-cbo-outlook-2025","src-treasury-debt-penny"], last_assessed:"2026-08-27", next_review:"2026-09-03", rationale:"CBO projections and Treasury administrative definitions were reviewed; policy resolution and alternative assumptions remain unassessed." },
 "ai-governance": { assessment_status:"provisional", status:"active", claims:["clm-ai-rmf-voluntary","clm-ai-ftc-enforcement"], events:["evt-nist-rmf","evt-ftc-ai-enforcement"], sources:["src-nist-ai-rmf","src-ftc-ai-comply"], last_assessed:"2026-08-27", next_review:"2026-09-03", rationale:"NIST guidance and FTC enforcement action were reviewed; the broader binding legal and international landscape remains unassessed." }
};
for (const topic of researchTopics) { const p=pilotEvidence[topic.id]; if (p) Object.assign(topic,p,{assessment_history:[...topic.assessment_history,{id:`${topic.id}-assessment-20260827`,assessed_at:p.last_assessed,kind:"human_reviewed_pilot",assessment_status:p.assessment_status,dimensions:{importance:topic.importance,substantive_uncertainty:null,institutional_disagreement:null,decision_incompleteness:null,momentum:topic.momentum},rationale:p.rationale}]}); }
