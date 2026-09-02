import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

import type {
  ExamBoardValueType,
  KeyStageTitleValueType,
  PathwayValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const mockTrackUnitAccessed = jest.fn();
const mockTrackLessonAccessed = jest.fn();
jest.mock("@/hooks/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(false),
}));
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    track: {
      unitAccessed: (...args: []) => mockTrackUnitAccessed(...args),
      lessonAccessed: (...args: []) => mockTrackLessonAccessed(...args),
    },
  }),
}));

const generateLessons = (
  count: number,
  state: string,
  indexOffset: number = 0,
) => {
  return Array.from({ length: count }, (_, localIndex) => {
    const index = localIndex + indexOffset;
    return {
      slug: `lesson-${index}-${state}`,
      order: index,
      title: `Lesson ${index}`,
      state: state,
    };
  });
};
const completeUnitLessons = generateLessons(5, "published");
const mockUnit = {
  index: 1,
  examBoard: "AQA" as ExamBoardValueType,
  unitTitle: "Saved Unit",
  unitSlug: "saved-unit",
  programmeSlug: "english-secondary-ks4-aqa",
  year: "Year 10",
  yearSlug: "year-10",
  savedAt: "2023-10-01T12:00:00Z",
  href: "/saved-unit",
  lessonCount: 5,
  keyStageTitle: "Key Stage 4" as KeyStageTitleValueType,
  keyStageSlug: "key-stage-4",
  subjectTitle: "English",
  subjectSlug: "english",
  pathway: "pathway-1" as PathwayValueType,
  tierName: "Foundation" as TierNameValueType,
};

// Mock secondary link so it doesn't attempt to navigate on click
jest.mock("@oaknational/oak-components", () => ({
  ...jest.requireActual("@oaknational/oak-components"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  OakLink: ({ children, onClick }: any) => (
    <a href="" onClick={onClick}>
      {children}
    </a>
  ),
}));

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

  it("formats the save time correctly when saved on the same day", () => {
    render(
      <MyLibraryUnitCard
        {...mockUnit}
        lessons={completeUnitLessons}
        // replace the save time with the current date
        savedAt={new Date().toISOString()}
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
    render(<MyLibraryUnitCard {...mockUnit} lessons={incompleteUnitLessons} />);

    const lesson0 = screen.getByText(/Lesson 0/);
    const styles = getComputedStyle(lesson0);
    expect(styles.color).toBe("rgb(128, 128, 128)");
  });
  it("calls trackUnitAccessed when a unit is clicked", async () => {
    render(<MyLibraryUnitCard {...mockUnit} lessons={completeUnitLessons} />);
    const unitLink = screen
      .getByRole("heading", { name: "Saved Unit" })
      .closest("a");
    if (!unitLink) {
      throw new Error("Unit link not found");
    }
    const user = userEvent.setup();
    await user.click(unitLink);
    expect(mockTrackUnitAccessed).toHaveBeenCalled();
  });
  it("calls trackLessonAccessed when a lesson is clicked", async () => {
    render(<MyLibraryUnitCard {...mockUnit} lessons={completeUnitLessons} />);
    const lessonLink = screen.getByText("Lesson 0");
    const user = userEvent.setup();
    await user.click(lessonLink);
    expect(mockTrackLessonAccessed).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
      componentType: "lesson_card",
      engagementIntent: "refine",
      eventVersion: "2.0.0",
      unitName: mockUnit.unitTitle,
      unitSlug: mockUnit.unitSlug,
      lessonName: "lesson-0-published",
      lessonSlug: "lesson-0-published",
      keyStageTitle: mockUnit.keyStageTitle,
      keyStageSlug: mockUnit.keyStageSlug,
      examBoard: mockUnit.examBoard,
      pathway: mockUnit.pathway,
      phase: "secondary",
      platform: "owa",
      product: "teacher lesson resources",
      releaseGroup: "2023",
      subjectSlug: "biology", // fallsback to default programme state values
      subjectTitle: "Biology",
      lessonReleaseCohort: "2023-2026",
      lessonReleaseDate: "",
      tierName: mockUnit.tierName,
      yearGroupName: mockUnit.year,
      yearGroupSlug: mockUnit.yearSlug,
    });
  });
});
