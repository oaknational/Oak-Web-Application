import { UseSearchFiltersReturnType } from "@/context/Search/search.types";

export const mockOnChange = vi.fn();
export const searchFilters: UseSearchFiltersReturnType = {
  legacyFilter: {
    slug: "new",
    title: "Show new only",
    onChange: mockOnChange,
    checked: false,
  },

  keyStageFilters: [
    {
      slug: "ks2",
      title: "Key stage 2",
      shortCode: "KS2",
      onChange: mockOnChange,
      checked: false,
    },
    {
      slug: "ks4",
      title: "Key stage 4",
      shortCode: "KS4",
      onChange: vi.fn(),
      checked: true,
    },
  ],
  subjectFilters: [
    {
      slug: "maths",
      title: "Maths",
      onChange: mockOnChange,
      checked: false,
    },
    {
      slug: "science",
      title: "Science",
      onChange: vi.fn(),
      checked: true,
    },
  ],
  contentTypeFilters: [
    { slug: "unit", title: "Units", onChange: mockOnChange, checked: false },
    {
      slug: "lesson",
      title: "Lessons",
      onChange: mockOnChange,
      checked: true,
    },
  ],
  examBoardFilters: [
    { slug: "aqa", title: "AQA", onChange: mockOnChange, checked: true },
    {
      slug: "ocr",
      title: "OCR",
      onChange: mockOnChange,
      checked: false,
    },
  ],
  yearGroupFilters: [
    {
      slug: "year-10",
      title: "Year 10",
      onChange: mockOnChange,
      checked: true,
    },
    {
      slug: "year-11",
      title: "Year 11",
      onChange: mockOnChange,
      checked: false,
    },
  ],
};
