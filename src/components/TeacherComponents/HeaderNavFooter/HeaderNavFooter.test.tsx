import { screen } from "@testing-library/dom";

import HeaderNavFooter, { HeaderNavFooterProps } from "./HeaderNavFooter";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const defaultProps: HeaderNavFooterProps = {
  backgroundColorLevel: 1,
  type: "unit",
  viewHref: "testUrl",
};

const render = renderWithTheme;

describe("HeaderNavFooter", () => {
  it("Renders the correct text for view href when type is unit", () => {
    render(<HeaderNavFooter {...defaultProps} />);

    const viewLink = screen.getByRole("link", { name: "View all units" });
    expect(viewLink).toBeInTheDocument();
  });
  it("Renders the correct text for view href when type is lesson", () => {
    render(<HeaderNavFooter {...defaultProps} type="lesson" />);

    const viewLink = screen.getByRole("link", { name: "View unit" });
    expect(viewLink).toBeInTheDocument();
  });
  it("Renders previous and next links with correct text for unit", () => {
    render(
      <HeaderNavFooter
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
      <HeaderNavFooter
        {...defaultProps}
        actionButton={<button>action button</button>}
      />,
    );

    const actionButton = screen.getByRole("button");
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveTextContent("action button");
  });
});
