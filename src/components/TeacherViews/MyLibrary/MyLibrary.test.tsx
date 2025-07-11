import { screen } from "@testing-library/dom";

import MyLibrary from "./MyLibrary";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { generateMockCollectionData } from "@/fixtures/teachers/myLibrary/collectionData";

const render = renderWithProviders();

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
});
