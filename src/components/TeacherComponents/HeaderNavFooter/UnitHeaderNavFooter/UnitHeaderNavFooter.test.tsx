import { screen } from "@testing-library/dom";

import {
  UnitHeaderNavFooter,
  UnitHeaderNavFooterProps,
} from "./UnitHeaderNavFooter";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const defaultProps: UnitHeaderNavFooterProps = {
  backgroundColorLevel: 3,
  viewHref: "testUrl",
};

const render = renderWithTheme;

describe("UnitHeaderNavFooter", () => {
  it("Renders the correct text for the view href", () => {
    render(<UnitHeaderNavFooter {...defaultProps} />);

    const viewLink = screen.getByRole("link", { name: "View all units" });
    expect(viewLink).toBeInTheDocument();
  });
  it("Renders previous and next links with correct text", () => {
    render(
      <UnitHeaderNavFooter
        {...defaultProps}
        prevHref="prevUrl"
        nextHref="nextUrl"
      />,
    );

    const prevLink = screen.getByRole("link", { name: "Previous unit" });
    expect(prevLink).toBeInTheDocument();

    const nextLink = screen.getByRole("link", { name: "Next unit" });
    expect(nextLink).toBeInTheDocument();
  });
  it("renders an action button", () => {
    render(
      <UnitHeaderNavFooter
        {...defaultProps}
        downloadButton={<button>action button</button>}
      />,
    );

    const actionButton = screen.getByRole("button");
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveTextContent("action button");
  });
});
