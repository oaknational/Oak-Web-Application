import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import MyLibrary from "./MyLibrary";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { generateMockCollectionData } from "@/fixtures/teachers/myLibrary/collectionData";

const render = renderWithProviders();

const mockTrackUnitAccessed = jest.fn();
const mockTrackLessonAccessed = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    track: {
      unitAccessed: (...args: []) => mockTrackUnitAccessed(...args),
      lessonAccessed: (...args: []) => mockTrackLessonAccessed(...args),
    },
  }),
}));

// Mock secondary link so it doesn't attempt to navigate on click
jest.mock("@oaknational/oak-components", () => ({
  ...jest.requireActual("@oaknational/oak-components"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  OakSecondaryLink: (args: any) => <a {...args} href="" />,
}));

describe("MyLibrary", () => {
  it("renders a header and no content when loading", () => {
    render(
      <MyLibrary
        collectionData={null}
        isLoading={true}
        onSaveToggle={() => {}}
        isUnitSaved={() => false}
        isUnitSaving={() => false}
      />,
    );
    expect(screen.getByText("My library")).toBeInTheDocument();
    expect(screen.queryByText("No units yet")).not.toBeInTheDocument();
  });
  it("renders a header and no content when there is no collection data", () => {
    render(
      <MyLibrary
        collectionData={[]}
        isLoading={false}
        onSaveToggle={() => {}}
        isUnitSaved={() => false}
        isUnitSaving={() => false}
      />,
    );
    expect(screen.getByText("My library")).toBeInTheDocument();
    expect(screen.queryByText("No units yet")).toBeInTheDocument();
  });
  it("renders a side menu with the correct items", () => {
    render(
      <MyLibrary
        collectionData={generateMockCollectionData(5)}
        isLoading={false}
        onSaveToggle={() => {}}
        isUnitSaved={() => false}
        isUnitSaving={() => false}
      />,
    );

    const sideMenuItems = screen.getAllByRole("link", { name: /Subject/i });
    expect(sideMenuItems).toHaveLength(5);
  });
  it("calls isUnitSaved with correct arguments", async () => {
    const mockIsUnitSaved = jest.fn().mockResolvedValue(true);
    render(
      <MyLibrary
        collectionData={generateMockCollectionData(1)}
        isLoading={false}
        onSaveToggle={jest.fn()}
        isUnitSaved={mockIsUnitSaved}
        isUnitSaving={jest.fn().mockResolvedValue(false)}
      />,
    );
    const saveButton = screen.getByRole("button", { name: /Save/i });
    const user = userEvent.setup();
    await user.click(saveButton);
    expect(mockIsUnitSaved).toHaveBeenCalledWith("unit-1-programme-1");
  });
  it("tracks unit accessed with the correct arguments", async () => {
    render(
      <MyLibrary
        collectionData={generateMockCollectionData(1)}
        isLoading={false}
        onSaveToggle={jest.fn()}
        isUnitSaved={() => false}
        isUnitSaving={() => false}
      />,
    );

    const unitLink = screen
      .getByRole("heading", { name: "Unit 1: Topic" })
      .closest("a");

    if (!unitLink) {
      throw new Error("Unit link not found");
    }

    const user = userEvent.setup();
    await user.click(unitLink);
    await waitFor(() =>
      expect(mockTrackUnitAccessed).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "unit_card",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        examBoard: "AQA",
        keyStageSlug: "ks4",
        keyStageTitle: "KS4",
        pathway: undefined,
        platform: "owa",
        product: "teacher lesson resources",
        subjectSlug: "subject-1",
        subjectTitle: "Subject 1",
        tierName: "Foundation",
        unitName: "Unit 1: Topic",
        unitSlug: "unit-1",
        yearGroupName: "Year 1",
        yearGroupSlug: "year-1",
      }),
    );
  });
  it("tracks lesson accessed with the correct arguments", async () => {
    render(
      <MyLibrary
        collectionData={generateMockCollectionData(1)}
        isLoading={false}
        onSaveToggle={jest.fn()}
        isUnitSaved={() => false}
        isUnitSaving={() => false}
      />,
    );

    const lessonLink = screen.getByText("Lesson 1 - Part 1");
    const user = userEvent.setup();
    await user.click(lessonLink);
    expect(mockTrackLessonAccessed).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
      componentType: "lesson_card",
      engagementIntent: "refine",
      eventVersion: "2.0.0",
      examBoard: "AQA",
      keyStageSlug: "ks4",
      keyStageTitle: "KS4",
      lessonName: "lesson-1-1",
      lessonReleaseCohort: "2023-2026",
      lessonReleaseDate: "",
      lessonSlug: "lesson-1-1",
      pathway: undefined,
      platform: "owa",
      product: "teacher lesson resources",
      tierName: "Foundation",
      unitName: "Unit 1: Topic",
      unitSlug: "unit-1",
      yearGroupName: "Year 1",
      yearGroupSlug: "year-1",
    });
  });
});
