import { SearchPageData } from "..";

const searchPageFixture = (
  partial?: Partial<SearchPageData>,
): SearchPageData[] => [
  {
    keyStages: [
      {
        shortCode: "KS1",
        slug: "ks1",
        title: "Key stage 1",
        displayOrder: 1,
      },
      {
        shortCode: "KS2",
        slug: "ks2",
        title: "Key stage 2",
        displayOrder: 2,
      },
      {
        shortCode: "KS3",
        slug: "ks3",
        title: "Key stage 3",
        displayOrder: 3,
      },
      {
        shortCode: "KS4",
        slug: "ks4",
        title: "Key stage 4",
        displayOrder: 4,
      },
    ],
    subjects: [
      { slug: "computing", title: "Computing", displayOrder: 1 },
      { slug: "english", title: "English", displayOrder: 2 },
      { slug: "maths", title: "Maths", displayOrder: 3 },
      { slug: "science", title: "science", displayOrder: 4 },
    ],
    contentTypes: [
      { slug: "unit", title: "Units" },
      { slug: "lesson", title: "Lessons" },
    ],
    ...partial,
  },
];
export default searchPageFixture;
