# National Curriculum Insights structure

The route mirrors the independently editable Sanity hierarchy:

- `/teachers/national-curriculum-insights` reads the hub document and its own ordered `modules`.
- `/teachers/national-curriculum-insights/<subject>` reads the subject itself as its Overview page.
- `/teachers/national-curriculum-insights/<subject>/primary` and `/secondary` read the corresponding referenced page when the subject has that tab.
- `/teachers/national-curriculum-insights/<subject>/<phase>/key-stage-1` reads a key-stage page referenced by that phase. Only configured key stages resolve.

The subject document is also its Overview page and owns the modules rendered at the subject root. Its ordered Primary and Secondary entries reference separate phase documents with their own ordered `modules`. Each phase can then reference an ordered set of independent key-stage pages. Navigation is outside all module arrays, so editors can reorder page content without changing the subject, phase or key-stage hierarchy and its canonical URLs. There is no `/overview` segment and no phase-first route.

Published requests use the Sanity `published` perspective and Next draft mode uses the `drafts` perspective. Runtime Zod validation rejects incomplete subjects, mismatched phase or key-stage references, invalid Primary/Secondary key-stage combinations and malformed modules before rendering.
