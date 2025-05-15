import { screen } from "@testing-library/dom";

import MyLibraryHeader from "./MyLibraryHeader";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("MyLibraryHeader", () => {
  it("renders a header", () => {
    render(<MyLibraryHeader />);
    const header = screen.getByRole("heading", {
      name: "My library",
    });
    expect(header).toBeInTheDocument();
  });
  it("renders a subheading", () => {
    render(<MyLibraryHeader />);
    const subheading = screen.getByText(
      "All your content in one handy place. Whether it's units you're teaching this term, or ideas and inspiration for curriculum development and lesson planning. Save what you need to your library.",
    );
    expect(subheading).toBeInTheDocument();
  });
});
