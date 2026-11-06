import { GetSearchFiltersReturnType } from "@/context/Search/search.types";

export const mockOnChange = jest.fn();
export const searchFilters: GetSearchFiltersReturnType = {
  legacyFilter: {
    slug: "new",
    title: "Show new only",
    filterKey: "curriculum",
    checked: false,
  },

  keyStageFilters: [
    {
      slug: "ks2",
      title: "Key stage 2",
      shortCode: "KS2",
      filterKey: "keyStages",
      checked: false,
    },
    {
      slug: "ks4",
      title: "Key stage 4",
      shortCode: "KS4",
      filterKey: "keyStages",
      checked: true,
    },
  ],
  subjectFilters: [
    {
      slug: "maths",
      title: "Maths",
      filterKey: "subjects",
      checked: false,
    },
    {
      slug: "science",
      title: "Science",
      filterKey: "subjects",
      checked: true,
    },
  ],
  contentTypeFilters: [
    { slug: "unit", title: "Units", filterKey: "contentTypes", checked: false },
    {
      slug: "lesson",
      title: "Lessons",
      filterKey: "contentTypes",
      checked: true,
    },
  ],
  examBoardFilters: [
    { slug: "aqa", title: "AQA", filterKey: "examBoards", checked: true },
    {
      slug: "ocr",
      title: "OCR",
      filterKey: "examBoards",
      checked: false,
    },
  ],
  yearGroupFilters: [
    {
      slug: "year-10",
      title: "Year 10",
      filterKey: "yearGroups",
      checked: true,
    },
    {
      slug: "year-11",
      title: "Year 11",
      filterKey: "yearGroups",
      checked: false,
    },
  ],
};
