import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import MyLibrary from "./MyLibrary";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { generateMockCollectionData } from "@/fixtures/teachers/myLibrary/collectionData";

const render = renderWithProviders();

const mockTrackUnitAccessed = jest.fn();
const mockTrackLessonAccessed = jest.fn();
const mockTrackBrowseRefined = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    track: {
      unitAccessed: (...args: []) => mockTrackUnitAccessed(...args),
      lessonAccessed: (...args: []) => mockTrackLessonAccessed(...args),
      browseRefined: (...args: []) => mockTrackBrowseRefined(...args),
    },
  }),
}));

const mockSaveToggle = jest.fn();
const mockIsUnitSavedInternal = jest.fn().mockReturnValue(false);
const mockIsUnitSaving = jest.fn().mockReturnValue(false);
jest.mock("@/node-lib/educator-api/helpers/saveUnits/useSaveUnits", () => ({
  useSaveUnits: () => ({
    onSaveToggle: mockSaveToggle,
    isUnitSaved: mockIsUnitSavedInternal,
    showSignIn: false,
    setShowSignIn: jest.fn(),
    isUnitSaving: mockIsUnitSaving,
  }),
}));

// Mock links so they don't attempt to navigate on click
jest.mock("@oaknational/oak-components", () => ({
  ...jest.requireActual("@oaknational/oak-components"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  OakLink: ({ children, onClick }: any) => (
    <a href="" onClick={onClick}>
      {children}
    </a>
  ),
}));

describe("MyLibrary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsUnitSavedInternal.mockReturnValue(false);
    mockIsUnitSaving.mockReturnValue(false);
  });

  it("renders a header and no content when loading", () => {
    render(
      <MyLibrary
        collectionData={null}
        isLoading={true}
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
        isUnitSaving={() => false}
      />,
    );

    const sideMenuItems = screen.getAllByRole("link", { name: /Subject/i });
    expect(sideMenuItems).toHaveLength(5);
  });
  it("tracks unit accessed with the correct arguments", async () => {
    render(
      <MyLibrary
        collectionData={generateMockCollectionData(1)}
        isLoading={false}
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
  it("shows Saved state when isUnitSaved returns true", () => {
    mockIsUnitSavedInternal.mockReturnValue(true);
    render(
      <MyLibrary
        collectionData={generateMockCollectionData(1)}
        isLoading={false}
        isUnitSaving={() => false}
      />,
    );
    const unsaveButtons = screen.getAllByRole("button", {
      name: /Unsave this unit/i,
    });
    expect(unsaveButtons[0]).toBeInTheDocument();
  });

  it("calls onSaveToggle when save button is clicked", async () => {
    render(
      <MyLibrary
        collectionData={generateMockCollectionData(1)}
        isLoading={false}
        isUnitSaving={() => false}
      />,
    );
    const [saveButton] = screen.getAllByRole("button", {
      name: /Save this unit/i,
    });
    if (!saveButton) throw new Error("Save button not found");
    const user = userEvent.setup();
    await user.click(saveButton);
    expect(mockSaveToggle).toHaveBeenCalledWith("unit-1");
  });

  it("tracks browse refined with the correct arguments", async () => {
    render(
      <MyLibrary
        collectionData={generateMockCollectionData(1)}
        isLoading={false}
        isUnitSaving={() => false}
      />,
    );

    const programmeLink = screen
      .getByRole("heading", { name: "Programme 1 KS4" })
      .closest("a");
    if (!programmeLink) {
      throw new Error("Programme link not found");
    }
    const user = userEvent.setup();
    await user.click(programmeLink);
    expect(mockTrackBrowseRefined).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
      componentType: "programme_card",
      engagementIntent: "refine",
      eventVersion: "2.0.0",
      platform: "owa",
      product: "teacher lesson resources",
      filterValue: "Subject 1",
      filterType: "Subject filter",
      activeFilters: [],
      googleLoginHint: null,
      clientEnvironment: null,
    });
  });
});
