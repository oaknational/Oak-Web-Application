import { screen } from "@testing-library/dom";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const mockProps = {
  index: 1,
  unitTitle: "Saved Unit Title",
  yearTitle: "Year 1",
  saveTime: "2023-10-01T12:00:00Z",
  href: "/saved-unit",
  lessonCount: 5,
  lessons: [
    {
      lessonSlug: "reading-complex-texts-about-crime-and-punishment",
      lessonTitle:
        "Reading and comparing two texts about prisons: London (1862) and Norway (2013)",
      description:
        "I can read two texts about the same topic - prisons - and begin to compare them.",
      pupilLessonOutcome:
        "I can read two texts about the same topic - prisons - and begin to compare them.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 1,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
  ],
  onSave: jest.fn(),
  isSaved: false,
};

describe("MyLibraryUnitCard", () => {
  it("renders a header", () => {
    render(<MyLibraryUnitCard {...mockProps} />);
    const header = screen.getByRole("heading", {
      name: "My library",
    });
    expect(header).toBeInTheDocument();
  });
  it("renders a subheading", () => {
    render(<MyLibraryUnitCard {...mockProps} />);
    const subheading = screen.getByText(
      "All your content in one handy place. Whether it's units you're teaching this term, or ideas and inspiration for curriculum development and lesson planning. Save what you need to your library.",
    );
    expect(subheading).toBeInTheDocument();
  });
});
