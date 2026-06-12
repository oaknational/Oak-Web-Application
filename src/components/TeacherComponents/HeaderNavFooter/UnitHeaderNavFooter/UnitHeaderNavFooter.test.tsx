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
  it("renders the title when stuck", () => {
    render(
      <UnitHeaderNavFooter
        {...defaultProps}
        isStuck={true}
        title="Unit title"
      />,
    );

    expect(screen.getByText("Unit title")).toBeInTheDocument();
  });
  it("renders the view all units link when not stuck", () => {
    render(
      <UnitHeaderNavFooter
        {...defaultProps}
        isStuck={false}
        title="Unit title"
        prevHref="prevUrl"
        nextHref="nextUrl"
      />,
    );

    expect(
      screen.getByRole("link", { name: "View all units" }),
    ).toBeInTheDocument();
  });
  it("renders in the stuck state with previous and next links", () => {
    render(
      <UnitHeaderNavFooter
        {...defaultProps}
        isStuck={true}
        title="Unit title"
        prevHref="prevUrl"
        nextHref="nextUrl"
        backgroundColorLevel={4}
        downloadButton={<button>action button</button>}
      />,
    );

    expect(screen.getByText("Unit title")).toBeInTheDocument();
    expect(screen.getByText("action button")).toBeInTheDocument();
  });
  it("forwards the sentinel ref", () => {
    const sentinelRef = jest.fn();
    render(<UnitHeaderNavFooter {...defaultProps} sentinelRef={sentinelRef} />);

    expect(sentinelRef).toHaveBeenCalled();
  });
});
