import { screen } from "@testing-library/dom";

import {
  LessonHeaderNavFooter,
  LessonHeaderNavFooterProps,
} from "./LessonHeaderNavFooter";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const defaultProps: LessonHeaderNavFooterProps = {
  backgroundColorLevel: 1,
  viewHref: "testUrl",
  downloadButton: <button>download</button>,
};

const render = renderWithTheme;

describe("LessonHeaderNavFooter", () => {
  it("Renders the correct text for the view href", () => {
    render(<LessonHeaderNavFooter {...defaultProps} />);

    const viewLink = screen.getByRole("link", { name: "View unit" });
    expect(viewLink).toBeInTheDocument();
  });
  it("Renders previous and next links with correct text", () => {
    render(
      <LessonHeaderNavFooter
        {...defaultProps}
        prevHref="prevUrl"
        nextHref="nextUrl"
      />,
    );

    const prevLink = screen.getByRole("link", { name: "Previous lesson" });
    expect(prevLink).toBeInTheDocument();

    const nextLink = screen.getByRole("link", { name: "Next lesson" });
    expect(nextLink).toBeInTheDocument();
  });
  it("renders an action button", () => {
    render(
      <LessonHeaderNavFooter
        {...defaultProps}
        downloadButton={<button>action button</button>}
      />,
    );

    const actionButton = screen.getByRole("button");
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveTextContent("action button");
  });
});
