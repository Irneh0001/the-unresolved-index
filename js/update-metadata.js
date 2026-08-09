// This writes a replaceable operational snapshot only. It never reads or mutates forecast history.
import { writeFileSync } from "node:fs";
import { countries } from "../data/countries.js";
import { topics } from "../data/topics.js";
import { metadata } from "../data/metadata.js";
const snapshot = { generatedAt:new Date().toISOString(), schemaVersion:metadata.schemaVersion, countryCount:countries.length, topicCount:topics.length, forecastHistory:"append-only" };
writeFileSync(new URL("../data/metadata.generated.json", import.meta.url), `${JSON.stringify(snapshot,null,2)}\n`);
console.log(`Metadata snapshot updated for ${topics.length} topics; forecast history remains append-only.`);
