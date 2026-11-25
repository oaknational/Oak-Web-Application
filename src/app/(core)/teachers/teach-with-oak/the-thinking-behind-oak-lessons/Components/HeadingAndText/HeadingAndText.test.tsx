import { screen } from "@testing-library/react";

import { HeadingAndText } from "./HeadingAndText";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("HeadingAndText", () => {
  it("renders the heading as an h3", () => {
    renderWithTheme(<HeadingAndText heading="What?" text="Some text" />);

    expect(
      screen.getByRole("heading", { level: 3, name: "What?" }),
    ).toBeInTheDocument();
  });

  it("renders a single string as a paragraph", () => {
    renderWithTheme(<HeadingAndText heading="What?" text="Some text" />);

    expect(screen.getByText("Some text").tagName).toBe("P");
  });

  it("renders strings as paragraphs and elements as-is when given an array", () => {
    renderWithTheme(
      <HeadingAndText
        heading="Oak in your classroom"
        text={[
          "First paragraph",
          <ul key="list" data-testid="custom-list">
            <li>List item</li>
          </ul>,
          "Second paragraph",
        ]}
      />,
    );

    expect(screen.getByText("First paragraph").tagName).toBe("P");
    expect(screen.getByText("Second paragraph").tagName).toBe("P");
    expect(screen.getByTestId("custom-list")).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveTextContent("List item");
  });

  it("renders a single element without wrapping it in a paragraph", () => {
    renderWithTheme(
      <HeadingAndText
        heading="Focused"
        text={<span key="span">Span content</span>}
      />,
    );

    expect(screen.getByText("Span content").tagName).toBe("SPAN");
    expect(screen.getByText("Span content").parentElement?.tagName).not.toBe(
      "P",
    );
  });
});
