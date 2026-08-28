# The Unresolved Index

A living, country-agnostic map of unresolved political, legal, economic, and geopolitical questions. Each topic separates **facts** (sourced claims), **interpretation** (competing explanations and constraints), and **forecast** (dated, uncertain scenarios).

## MVP status

This first edition contains an editorial baseline for 20 United States priority topics. It intentionally makes no claims about current events: add evidence before publishing facts, and add dated forecast records before publishing a forecast.

## Architecture

```text
index.html + assets/styles.css       UI
js/app.js                            UI rendering and filtering
data/countries.js                    Country and domain catalogue
data/topics.js                       Topic hierarchy and editorial baseline
data/evidence.js                     Events, sources, positions, resolutions
data/forecasts.js                    Append-only forecast records
js/schema.js + js/validate-data.js   Schema and validation
js/update-metadata.js                Non-destructive update hook
```

The browser UI imports data modules; it does not contain topic content itself. This keeps the site ready for hundreds of records and additional countries.

## Data model

`Country → Domain → Topic → Subtopic → Events / Evidence / Positions / Possible resolutions / Forecasts / History`.

A topic has `facts`, `interpretation`, `definitionOfResolved`, record IDs, signals, and history. Evidence records should include an ID, topic ID, title, publisher, URL, publication date, access date, claim, and source type. Forecasts have an ID, topic ID, `asOf`, horizon, scenario, confidence, rationale/evidence references, and optional `supersedes` pointer.

## Local development

No dependencies are required. Serve the directory with any static server, then open `index.html`. Validate data with:

```sh
npm run validate
npm run update-metadata
```

## GitHub Pages deployment

This is a plain static site. In GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**, select `main` and `/ (root)`, then save. The published URL will be shown in that panel.

## GitHub Actions

`.github/workflows/index-maintenance.yml` validates records on relevant pushes and pull requests, rejects removed forecast lines, updates the generated metadata snapshot, and includes a scheduled weekly check. It has no AI API dependency. Forecast history is append-only by policy; a future updater must create a new dated record rather than edit or remove an old one.

## Add a country

1. Add a country object and its enabled domains in `data/countries.js`.
2. Add topic records with that `countryId` in `data/topics.js`.
3. Add evidence, positions, possible resolutions, and forecasts in their respective data modules.
4. Run validation and verify the country selector.

## Add a topic

Create a unique ID and include every required field from `js/schema.js`. Start as `editorialBaseline: true` with no factual assertion. When publishing facts, link source records through `evidenceIds`; the validator rejects unsourced non-baseline topics.

## Forecasts

Forecasts are historical records, not a mutable “latest prediction.” Publish a new dated record and set `supersedes` to the prior record when revising a view. Never silently overwrite or remove a prior forecast.

## Roadmap

- Add reviewed evidence and event records
- Add country pages and cross-country comparisons
- Add source review and editorial workflow
- Add explicit, append-only scheduled metadata snapshots
- Add forecast calibration and resolution tracking

## Phase 1 research engine

Phase 1 adds auditable research infrastructure under `data/research/`, `schemas/`, `scripts/`, and `data/ledger/`. It does not research the web, call an AI API, publish new claims, or autonomously change forecasts or resolution status. See [the methodology](docs/methodology.md) and the scheduled `research-daily.yml` workflow.

## Source discovery engine

The Phase 3 discovery layer is deliberately separate from publication. `data/research/source_registry.js` adds per-source cadence, access method, enablement, and check timestamps. `scripts/discover-sources.mjs` fetches configured RSS/Atom feeds, normalizes items, deduplicates URLs, and emits candidate updates. Candidates are stored in `data/research/candidates.generated.json` by the scheduled workflow and remain `pending` until an editor reviews them. A candidate can then be promoted into a sourced claim, event, position, or forecast revision; discovery never silently changes published records.

Cadence defaults follow the topic domain (geopolitics six hours, governance/law/technology daily, economy every three days, society monthly) and can be overridden per source. Sources without a configured `feed_url` are intentionally not fetched until an adapter is added. This keeps the engine dependency-free and makes source coverage explicit.
