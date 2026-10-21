export const sectionColours = ["mint", "purple", "teal", "blue"] as const;

// Explicit list membership takes precedence over a paragraph's heading style.
export const mammothStyleMap = [
  ...[1, 2, 3, 4, 5].flatMap((level) => {
    const parent = "ul|ol > li > ".repeat(level - 1);
    return [
      `p:unordered-list(${level}) => ${parent}ul > li:fresh`,
      `p:ordered-list(${level}) => ${parent}ol > li:fresh`,
    ];
  }),
  "p.Title => h1.docx-title:fresh",
  "p.Subtitle => p.docx-subtitle:fresh",
  ...[1, 2, 3, 4, 5, 6].flatMap((level) => [
    `p.Heading${level} => h${level}:fresh`,
    `p[style-name='Heading ${level}'] => h${level}:fresh`,
    `p[style-name='heading ${level}'] => h${level}:fresh`,
  ]),
  "p[style-name='Title'] => h1.docx-title:fresh",
  "p[style-name='Subtitle'] => p.docx-subtitle:fresh",
  "p[style-name='Caption'] => p.docx-caption:fresh",
  "r[style-name='Strong'] => strong",
  "r[style-name='Emphasis'] => em",
  "b => strong",
  "i => em",
  "u => u",
  "strike => s",
  "table => div.docx-table:fresh > table:fresh",
];
