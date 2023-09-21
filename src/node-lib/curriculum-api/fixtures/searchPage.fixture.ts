import { SearchPageData } from "..";

const searchPageFixture = (
  partial?: Partial<SearchPageData>,
): SearchPageData => {
  return {
    keyStages: [
      { shortCode: "KS1", slug: "ks1", title: "Key stage 1" },
      { shortCode: "KS2", slug: "ks2", title: "Key stage 2" },
      { shortCode: "KS3", slug: "ks3", title: "Key stage 3" },
      { shortCode: "KS4", slug: "ks4", title: "Key stage 4" },
    ],
    subjects: [
      { slug: "computing", title: "Computing" },
      { slug: "english", title: "English" },
      { slug: "maths", title: "Maths" },
      { slug: "science", title: "science" },
    ],
    contentTypes: [
      { slug: "unit", title: "Units" },
      { slug: "lesson", title: "Lessons" },
    ],
    ...partial,
  };
};

export default searchPageFixture;
