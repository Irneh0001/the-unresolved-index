import { execFileSync } from "node:child_process";
const base = process.env.FORECAST_BASE_SHA;
if (!base) { console.log("No comparison base supplied; forecast history check skipped."); process.exit(0); }
const diff = execFileSync("git", ["diff", "--unified=0", base, "HEAD", "--", "data/forecasts.js"], { encoding:"utf8" });
const removed = diff.split("\n").filter(line => line.startsWith("-") && !line.startsWith("---"));
if (removed.length) { console.error("Forecast history is append-only. Removed or altered forecast lines require an explicit migration review."); process.exit(1); }
console.log("Forecast history check passed: no existing forecast lines removed.");
