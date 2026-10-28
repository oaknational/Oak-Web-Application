import { screen } from "@testing-library/react";

import { ImagesSection } from "./ImagesSection";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const images = [
  {
    heading: "Chunked",
    src: "https://example.com/chunked.png",
    alt: "Chunked alt text",
    height: 1236,
    width: 630,
  },
  {
    src: "https://example.com/clear.png",
    alt: "Clear alt text",
    height: 630,
    width: 370,
    caption: "etymology",
  },
];

describe("ImagesSection", () => {
  it("renders the section heading", () => {
    renderWithTheme(<ImagesSection images={images} />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "What does this look like in Oak lessons?",
      }),
    ).toBeInTheDocument();
  });

  it("renders every image with its alt text", () => {
    renderWithTheme(<ImagesSection images={images} />);

    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByAltText("Chunked alt text")).toBeInTheDocument();
    expect(screen.getByAltText("Clear alt text")).toBeInTheDocument();
  });

  it("only renders image headings when provided", () => {
    renderWithTheme(<ImagesSection images={images} />);

    const imageHeadings = screen.getAllByRole("heading", { level: 4 });
    expect(imageHeadings).toHaveLength(1);
    expect(imageHeadings[0]).toHaveTextContent("Chunked");
  });

  it("only renders captions when provided", () => {
    const { container } = renderWithTheme(<ImagesSection images={images} />);

    expect(screen.getByText("etymology")).toBeInTheDocument();
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });
});
