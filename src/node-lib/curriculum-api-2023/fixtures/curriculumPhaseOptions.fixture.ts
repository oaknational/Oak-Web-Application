import { CurriculumPhaseOptions } from "..";

const curriculumPhaseOptionsFixture = (): CurriculumPhaseOptions => [
  {
    title: "English",
    slug: "english",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel", slug: "edexcel" },
    ],
    keystages: [
      { title: "KS1", slug: "ks1" },
      { title: "KS3", slug: "ks3" },
    ],
  },
  {
    title: "Geography",
    slug: "geography",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: null,
    keystages: [
      { title: "KS1", slug: "ks1" },
      { title: "KS3", slug: "ks3" },
    ],
  },
  {
    title: "History",
    slug: "history",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel", slug: "edexcel" },
    ],
    keystages: [
      { title: "KS1", slug: "ks1" },
      { title: "KS3", slug: "ks3" },
    ],
  },
  {
    title: "Maths",
    slug: "maths",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: null,
    keystages: [
      { title: "KS1", slug: "ks1" },
      { title: "KS3", slug: "ks3" },
    ],
  },
  {
    title: "Music",
    slug: "music",
    phases: [{ title: "Secondary", slug: "secondary" }],
    ks4_options: null,
    keystages: [
      { title: "KS1", slug: "ks1" },
      { title: "KS3", slug: "ks3" },
    ],
  },
  {
    title: "Science",
    slug: "science",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: null,
    keystages: [
      { title: "KS1", slug: "ks1" },
      { title: "KS3", slug: "ks3" },
    ],
  },
];
export default curriculumPhaseOptionsFixture;
