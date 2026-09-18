import { researchTopics } from "../data/research/topics.js";
import { claims } from "../data/research/claims.js";
import { forecasts } from "../data/research/forecasts.js";

const publishedForecasts = forecasts.filter(f => f.status === "published");
const result = researchTopics.map(topic => {
  const topicClaims = claims.filter(c => c.topic_id === topic.id);
  const latestEvidence = topicClaims.reduce((latest, claim) => {
    const at = claim.updated_at || claim.last_verified || claim.created_at || claim.first_observed || "";
    return at > latest ? at : latest;
  }, "");
  const topicForecasts = publishedForecasts.filter(f => f.topic_id === topic.id);
  const latestForecast = topicForecasts.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))[0] || null;
  const forecastStale = Boolean(latestEvidence && (!latestForecast || latestEvidence > latestForecast.created_at));
  return { topic_id: topic.id, latest_evidence_at: latestEvidence || null, latest_forecast_id: latestForecast?.id ?? null, latest_forecast_at: latestForecast?.created_at ?? null, forecast_stale: forecastStale, reason: forecastStale ? "newer evidence requires an append-only forecast update" : null };
}).filter(item => item.forecast_stale);

console.log(JSON.stringify({ generated_at: new Date().toISOString(), reviews: result }, null, 2));
