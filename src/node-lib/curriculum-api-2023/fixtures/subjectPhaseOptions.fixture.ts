import { SubjectPhaseOption } from "..";

const subjectPhaseOptionsFixture = (): SubjectPhaseOption[] => [
  {
    title: "English",
    slug: "english",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    examboards: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel", slug: "edexcel" },
    ],
  },
  {
    title: "Geography",
    slug: "geography",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    examboards: null,
  },
  {
    title: "History",
    slug: "history",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    examboards: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel", slug: "edexcel" },
    ],
  },
  {
    title: "Maths",
    slug: "maths",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    examboards: null,
  },
  {
    title: "Music",
    slug: "music",
    phases: [{ title: "Secondary", slug: "secondary" }],
    examboards: null,
  },
  {
    title: "Science",
    slug: "science",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    examboards: null,
  },
];
export default subjectPhaseOptionsFixture;
