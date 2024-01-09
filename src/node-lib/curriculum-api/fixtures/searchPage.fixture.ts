import { SearchPageData } from "@/node-lib/curriculum-api-2023";

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
    examBoards: [
      { slug: "aqa", title: "AQA", displayOrder: 1 },
      { slug: "edexcel", title: "Edexcel", displayOrder: 2 },
      { slug: "eduqas", title: "Eduqas", displayOrder: 3 },
      { slug: "ocr", title: "OCR", displayOrder: 4 },
    ],
    ...partial,
  };
};

export default searchPageFixture;
