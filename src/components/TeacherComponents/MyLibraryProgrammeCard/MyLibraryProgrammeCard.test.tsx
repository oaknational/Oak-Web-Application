import { screen } from "@testing-library/react";
import { OakIconName } from "@oaknational/oak-components";

import MyLibraryProgrammeCard from "./MyLibraryProgrammeCard";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  completeUnitLessons,
  incompleteUnitLessons,
} from "@/fixtures/teachers/myLibrary";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

const render = renderWithProviders();

// Sample units for testing
const mockUnits = [
  {
    index: 1,
    unitTitle: "Fiction: Short Stories",
    unitSlug: "fiction-short-stories",
    programmeSlug: "english-secondary-ks4",
    year: "Year 10",
    savedAt: "2023-05-01T09:00:00Z",
    href: "/teachers/programmes/english-secondary-ks4/units/fiction-short-stories",
    lessons: completeUnitLessons,
    keyStageTitle: "Key Stage 4" as KeyStageTitleValueType,
    keyStageSlug: "key-stage-4",
    subjectTitle: "English",
    subjectSlug: "english",
    trackUnitAccessed: jest.fn(),
    trackLessonAccessed: jest.fn(),
  },
  {
    unitTitle: "Poetry Analysis",
    unitSlug: "poetry-analysis",
    programmeSlug: "english-secondary-ks4",
    year: "Year 9",
    savedAt: "2023-04-15T14:30:00Z",
    href: "/teachers/programmes/english-secondary-ks4/units/poetry-analysis",
    lessons: incompleteUnitLessons,
    keyStageTitle: "Key Stage 3" as KeyStageTitleValueType,
    keyStageSlug: "key-stage-3",
    subjectTitle: "English",
    subjectSlug: "english",
    trackUnitAccessed: jest.fn(),
    trackLessonAccessed: jest.fn(),
  },
];

// Default props for the component
const defaultProps = {
  programmeTitle: "English Secondary KS4",
  programmeHref: "/teachers/programmes/english-secondary-ks4",
  iconName: "subject-english" as OakIconName,
  savedUnits: mockUnits,
  anchorId: "english-secondary-ks4",
  trackBrowseRefined: jest.fn(),
};

describe("MyLibraryProgrammeCard", () => {
  it("renders the programme header with correct title", () => {
    render(<MyLibraryProgrammeCard {...defaultProps} />);

    expect(screen.getByText("English Secondary KS4")).toBeInTheDocument();
  });

  it("renders a subject icon in the header", async () => {
    render(<MyLibraryProgrammeCard {...defaultProps} />);

    const subjectIcon = await screen.getByTestId("subjectIcon");
    expect(subjectIcon).toBeInTheDocument();
  });

  it("renders a clickable programme header with correct href", () => {
    render(<MyLibraryProgrammeCard {...defaultProps} />);

    const headerLink = screen.getByRole("link", {
      name: /English Secondary KS4/i,
    });
    expect(headerLink).toHaveAttribute(
      "href",
      "/teachers/programmes/english-secondary-ks4",
    );
  });

  it("renders all unit cards", () => {
    render(<MyLibraryProgrammeCard {...defaultProps} />);

    // Check unit titles
    expect(screen.getByText(/Fiction: Short Stories/)).toBeInTheDocument();
    expect(screen.getByText(/Poetry Analysis/)).toBeInTheDocument();

    // Check unit details
    expect(screen.getByText(/Year 10/)).toBeInTheDocument();
    expect(screen.getByText(/Year 9/)).toBeInTheDocument();
  });
});
