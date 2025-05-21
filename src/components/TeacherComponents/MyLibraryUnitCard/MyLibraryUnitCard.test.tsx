import { screen } from "@testing-library/dom";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const generateLessons = (count: number, state: string) => {
  return Array.from({ length: count }, (_, index) => ({
    slug: `lesson-${index}`,
    order: index,
    title: `Lesson ${index}`,
    _state: state,
    lesson_uid: `LESS-${index}`,
  }));
};

const completeUnitLessons = generateLessons(5, "published");
const mockUnit = {
  index: 1,
  unitTitle: "Saved Unit",
  unitSlug: "saved-unit",
  programmeSlug: "english-secondary-ks4-aqa",
  yearTitle: "Year 10",
  saveTime: "2023-10-01T12:00:00Z",
  href: "/saved-unit",
  lessonCount: 5,
  onSave: jest.fn(),
  isSaved: false,
};

describe.skip("MyLibraryUnitCard", () => {
  it("renders unit heading", () => {
    render(<MyLibraryUnitCard {...mockUnit} lessons={completeUnitLessons} />);
    expect(screen.getByText("Saved Unit")).toBeInTheDocument();
  });
});
