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
    cycle: "1",
  },
  {
    title: "Geography",
    slug: "geography",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    examboards: null,
    cycle: "1",
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
    cycle: "1",
  },
  {
    title: "Maths",
    slug: "maths",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    examboards: null,
    cycle: "1",
  },
  {
    title: "Music",
    slug: "music",
    phases: [{ title: "Secondary", slug: "secondary" }],
    examboards: null,
    cycle: "1",
  },
  {
    title: "Science",
    slug: "science",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    examboards: null,
    cycle: "1",
  },
];
export default subjectPhaseOptionsFixture;
