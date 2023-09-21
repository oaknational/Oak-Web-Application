import { UseSearchFiltersReturnType } from "@/context/Search/search.types";

export const mockOnChange = jest.fn();
export const searchFilters: UseSearchFiltersReturnType = {
  keyStageFilters: [
    {
      slug: "ks2",
      title: "Key-stage 2",
      shortCode: "KS2",
      onChange: mockOnChange,
      checked: false,
    },
    {
      slug: "ks4",
      title: "Key-stage 4",
      shortCode: "KS4",
      onChange: jest.fn(),
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
      onChange: jest.fn(),
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
};
