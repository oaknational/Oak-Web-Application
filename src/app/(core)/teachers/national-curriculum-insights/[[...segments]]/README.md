# National Curriculum Insights structure

The route mirrors the independently editable Sanity hierarchy:

- `/teachers/national-curriculum-insights` reads the hub document and its own ordered `modules`.
- `/curriculum-change-explained/guidance` reads the separate guidance document, whether or not the hub is published. The previous guidance URL redirects here.
- `/teachers/national-curriculum-insights/<subject>` reads the subject itself as its Overview page.
- `/teachers/national-curriculum-insights/<subject>/primary` and `/secondary` read the corresponding referenced page when the subject has that tab.
- `/teachers/national-curriculum-insights/<subject>/<phase>/key-stage-1` reads a key-stage page referenced by that phase. Only configured key stages resolve.

The subject document is also its Overview page and owns the modules rendered at the subject root. Its ordered Primary and Secondary entries reference separate phase documents with their own ordered `modules`. Each phase can then reference an ordered set of independent key-stage pages. Navigation is outside all module arrays, so editors can reorder page content without changing the subject, phase or key-stage hierarchy and its canonical URLs. There is no `/overview` segment and no phase-first route.

Published requests use the Sanity `published` perspective and Next draft mode uses the `drafts` perspective. Runtime Zod validation rejects incomplete subjects, mismatched phase or key-stage references, invalid Primary/Secondary key-stage combinations and malformed modules before rendering.

## Rendering and content

The reader uses GROQ, with queries in `nationalCurriculumInsightsGroq.ts` and runtime contracts in `common-lib/cms-types/nationalCurriculumInsights.ts`. Internal links are resolved in the same query and perspective as their page. Unavailable link targets leave the link text visible without exposing a draft URL.

`NationalCurriculumInsightsSections.tsx` exports the modules from `sections/`. Each module owns its layout; `sections/shared.tsx` contains shared presentation helpers. The optional navigation module renders route-derived tabs only when included in the CMS module list.

Subject illustrations and editorial images are editable in Sanity. Guidance modules also own the short heading, image mirroring and optional video heading illustration. Fixed phase/key-stage artwork and fallback asset IDs live in `nationalCurriculumInsightsAssets.ts`; their URLs use the configured Sanity project and dataset.

## Local fixtures

`__fixtures__/` contains synthetic test content and optional local preview snapshots. Tests import these explicitly. The live reader never falls back to them when CMS requests fail.

To use the snapshots locally, set `NATIONAL_CURRICULUM_INSIGHTS_LOCAL_FIXTURES=true` in development. A non-development local preview additionally requires `NATIONAL_CURRICULUM_INSIGHTS_LOCAL_PREVIEW_RUNTIME=true`. Both must remain unset for deployed Oak environments. The fixture reader is loaded only after those checks pass.
