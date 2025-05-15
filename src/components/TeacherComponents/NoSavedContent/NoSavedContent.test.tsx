import { screen } from "@testing-library/dom";

import NoSavedContent from "./NoSavedContent";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();
describe("NoSavedContent", () => {
  it("renders a header", () => {
    render(<NoSavedContent />);
    const header = screen.getByRole("heading", {
      name: /No units yet/i,
    });
    expect(header).toBeInTheDocument();
  });
  it("renders a button as a link", () => {
    render(<NoSavedContent />);
    const buttonAsLink = screen.getByRole("link", {
      name: /Start saving/i,
    });
    expect(buttonAsLink).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks1/subjects",
    );
  });
});
