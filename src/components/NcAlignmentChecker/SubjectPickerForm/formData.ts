export const KEY_STAGES = [
  { title: "Key stage 1", slug: "ks1" },
  { title: "Key stage 2", slug: "ks2" },
];

export const YEAR_GROUPS = [
  { title: "Year 1", slug: "year-1" },
  { title: "Year 2", slug: "year-2" },
  { title: "Year 3", slug: "year-3" },
  { title: "Year 4", slug: "year-4" },
  { title: "Year 5", slug: "year-5" },
  { title: "Year 6", slug: "year-6" },
];

export const KEY_STAGE_QUESTION = { noun: "key stage", options: KEY_STAGES };
export const YEAR_GROUP_QUESTION = { noun: "year group", options: YEAR_GROUPS };

export const SUBJECTS = [
  {
    title: "Art and design",
    slug: "art",
    yearOrKeyStageQuestion: KEY_STAGE_QUESTION,
  },
  {
    title: "Computing",
    slug: "computing",
    yearOrKeyStageQuestion: KEY_STAGE_QUESTION,
  },
  {
    title: "Design and technology",
    slug: "design-technology",
    yearOrKeyStageQuestion: KEY_STAGE_QUESTION,
  },
  {
    title: "Food and nutrition",
    slug: "food-nutrition",
    icon: "cooking-nutrition",
    yearOrKeyStageQuestion: KEY_STAGE_QUESTION,
  },
  {
    title: "History",
    slug: "history",
    yearOrKeyStageQuestion: KEY_STAGE_QUESTION,
  },
  {
    title: "Maths",
    slug: "maths",
    yearOrKeyStageQuestion: YEAR_GROUP_QUESTION,
  },
  {
    title: "Science",
    slug: "science",
    yearOrKeyStageQuestion: KEY_STAGE_QUESTION,
  },
];
