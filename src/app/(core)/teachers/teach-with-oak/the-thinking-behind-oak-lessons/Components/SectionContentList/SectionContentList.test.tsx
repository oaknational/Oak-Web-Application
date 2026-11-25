import { screen } from "@testing-library/react";

import { SectionContent, SectionContentList } from "./SectionContentList";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const content: SectionContent = [
  { type: "heading-and-text", heading: "What?", text: "What text" },
  {
    type: "images",
    id: "images-1",
    images: [
      {
        src: "https://example.com/image.png",
        alt: "Example image",
        height: 100,
        width: 100,
      },
    ],
  },
  { type: "heading-and-text", heading: "Why?", text: "Why text" },
  {
    type: "callout",
    id: "callout-1",
    quote: "Callout quote text",
  },
];

describe("SectionContentList", () => {
  it("renders each content item in order using the matching component", () => {
    renderWithTheme(<SectionContentList content={content} />);

    expect(
      screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent),
    ).toEqual(["What?", "What does this look like in Oak lessons?", "Why?"]);
    expect(screen.getByText("What text")).toBeInTheDocument();
    expect(screen.getByText("Why text")).toBeInTheDocument();
    expect(screen.getByAltText("Example image")).toBeInTheDocument();
    expect(screen.getByText(/Callout quote text/)).toBeInTheDocument();
  });

  it("renders nothing for empty content", () => {
    const { container } = renderWithTheme(<SectionContentList content={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
