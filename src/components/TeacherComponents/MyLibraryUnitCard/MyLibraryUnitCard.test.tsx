import { screen } from "@testing-library/dom";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("@/hooks/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(false),
}));

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

const incompleteUnitLessons = generateLessons(2, "new");

describe("MyLibraryUnitCard", () => {
  it("renders unit info", () => {
    render(<MyLibraryUnitCard {...mockUnit} lessons={completeUnitLessons} />);
    expect(screen.getByText(/Saved Unit/)).toBeInTheDocument();
    expect(screen.getByText(/Year 10/)).toBeInTheDocument();
    expect(screen.getByText(/5 lessons/)).toBeInTheDocument();
    expect(screen.getByText(/Lesson 0/)).toBeInTheDocument();
    expect(screen.getByText(/01\/10\/23, 13:00/)).toBeInTheDocument();
  });
  it("renders a save button", () => {
    render(<MyLibraryUnitCard {...mockUnit} lessons={completeUnitLessons} />);
    const saveButton = screen.getByRole("button", {
      name: /Save this unit: Saved Unit/i,
    });
    expect(saveButton).toBeInTheDocument();
  });
  it("calls onSave when save button is clicked", () => {
    render(<MyLibraryUnitCard {...mockUnit} lessons={completeUnitLessons} />);
    const saveButton = screen.getByRole("button", {
      name: /Save this unit: Saved Unit/i,
    });
    saveButton.click();
    expect(mockUnit.onSave).toHaveBeenCalled();
  });
  it("changes the save button when isSaved is true", () => {
    render(
      <MyLibraryUnitCard {...mockUnit} lessons={completeUnitLessons} isSaved />,
    );
    const saveButton = screen.getByRole("button", {
      name: /Unsave this unit: Saved Unit/i,
    });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent("Saved");
  });

  it("displays correct partial lesson count when some are unpublished", () => {
    const mixedLessons = [
      ...generateLessons(2, "published"),
      ...generateLessons(3, "new"),
    ];
    render(<MyLibraryUnitCard {...mockUnit} lessons={mixedLessons} />);
    expect(screen.getByText("2/5 lessons")).toBeInTheDocument();
  });

  it("renders incomplete unit lessons with correct font color", () => {
    render(
      <MyLibraryUnitCard
        {...mockUnit}
        lessons={incompleteUnitLessons}
        isSaved
      />,
    );

    const lesson0 = screen.getByText(/Lesson 0/);
    const styles = getComputedStyle(lesson0);
    console.log(styles);
    expect(styles.color).toBe("rgb(128, 128, 128)");
  });
});
