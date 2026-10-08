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

Route components live in `components/`, with editable page modules in `components/sections/`. `components/Sections.tsx` exports those modules. `components/sections/shared.tsx` contains shared presentation helpers. The optional navigation module renders route-derived tabs only when included in the CMS module list.

Subject illustrations and editorial images are editable in Sanity. Guidance modules also own the short heading, image mirroring and optional video heading illustration. Fixed phase/key-stage artwork and fallback asset IDs live in `helpers/assets.ts`; their URLs use the configured Sanity project and dataset. Route resolution, hierarchy presentation and newsletter configuration also live in `helpers/`.

The default reader memoises CMS reads within a server render using React `cache`, keyed by slug and preview mode. It does not retain content between requests, so publishing and draft edits remain visible on the next request.

## Test fixtures

`__fixtures__/` contains small synthetic fixtures imported explicitly by tests and Storybook stories. Runtime content always comes from the configured CMS client; it never falls back to fixture data when CMS requests fail.

For local development, configure the same isolated Sanity dataset as the feature preview using the project's existing environment configuration. Dataset exports and local preview tools should remain outside the repository.
