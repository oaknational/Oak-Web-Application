import { screen } from "@testing-library/dom";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("@/hooks/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(false),
}));

const generateLessons = (
  count: number,
  state: string,
  indexOffset: number = 0,
) => {
  return Array.from({ length: count }, (_, localIndex) => {
    const index = localIndex + indexOffset;
    return {
      slug: `lesson-${index}`,
      order: index,
      title: `Lesson ${index}`,
      _state: state,
      lesson_uid: `LESS-${index}`,
    };
  });
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
    // The save time is formatted as "Saved on _Date_ at _time_"
    expect(screen.getByText(/Saved on/)).toBeInTheDocument();
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

  it("formats the save time correctly when saved on the same day", () => {
    render(
      <MyLibraryUnitCard
        {...mockUnit}
        lessons={completeUnitLessons}
        // replace the save time with the current date
        saveTime={new Date().toISOString()}
      />,
    );
    // The save time is formatted as "Saved at _time_"
    const saveTime = screen.getByText(/Saved at/);
    expect(saveTime).toBeInTheDocument();
  });

  it("displays correct partial lesson count when some are unpublished", () => {
    const mixedLessons = [
      ...generateLessons(2, "published"),
      ...generateLessons(3, "new", 3),
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
    expect(styles.color).toBe("rgb(128, 128, 128)");
  });
});
