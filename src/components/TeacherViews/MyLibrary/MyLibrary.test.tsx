import { screen } from "@testing-library/dom";

import MyLibrary, { CollectionData } from "./MyLibrary";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

export const generateMockCollectionData = (count: number): CollectionData => {
  return Array.from({ length: count }, (_, index) => ({
    subject: `Subject ${index + 1}`,
    subheading: index % 2 === 0 ? `AQA foundation` : `Edexcel higher`,
    examboard: index % 2 === 0 ? "AQA" : "Edexcel",
    tier: index % 2 === 0 ? "foundation" : "higher",
    keystage: "KS4",
    units: [
      {
        unitSlug: `unit-${index + 1}`,
        unitTitle: `Unit ${index + 1}: Topic`,
        optionalityTitle: null,
        savedAt: new Date().toISOString(),
        unitOrder: 1,
        yearOrder: 1,
        lessons: [
          {
            slug: `lesson-${index + 1}-1`,
            title: `Lesson ${index + 1} - Part 1`,
            state: "saved",
            order: 1,
          },
          {
            slug: `lesson-${index + 1}-2`,
            title: `Lesson ${index + 1} - Part 2`,
            state: "saved",
            order: 2,
          },
        ],
      },
    ],
    programmeSlug: `programme-${index + 1}`,
  }));
};

describe("MyLibrary", () => {
  it("renders a header and no content when loading", () => {
    render(<MyLibrary collectionData={null} isLoading={true} />);
    expect(screen.getByText("My library")).toBeInTheDocument();
    expect(screen.queryByText("No saved content")).not.toBeInTheDocument();
  });
  it("renders a header and no content when there is no collection data", () => {
    render(<MyLibrary collectionData={[]} isLoading={false} />);
    expect(screen.getByText("My library")).toBeInTheDocument();
    expect(screen.queryByText("No units yet")).toBeInTheDocument();
  });
  it("renders a side menu with the correct items", () => {
    render(
      <MyLibrary
        collectionData={generateMockCollectionData(5)}
        isLoading={false}
      />,
    );

    const sideMenuItems = screen.getAllByRole("link", { name: /Subject/i });
    expect(sideMenuItems).toHaveLength(5);
  });
});
