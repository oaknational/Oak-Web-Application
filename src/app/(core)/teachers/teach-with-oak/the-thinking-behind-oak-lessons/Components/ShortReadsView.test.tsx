import { screen, within } from "@testing-library/react";

import { ShortReadsView } from "./ShortReadsView";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("ShortReadsView", () => {
  it("renders breadcrumbs with the current page as non-clickable text", () => {
    renderWithTheme(<ShortReadsView />);

    const breadcrumbs = within(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    );
    expect(
      breadcrumbs.getByRole("link", { name: "Teach with Oak" }),
    ).toHaveAttribute("href", "/teachers/teach-with-oak");
    expect(
      breadcrumbs.getByText("The thinking behind Oak lessons"),
    ).toHaveAttribute("aria-current", "page");
  });

  it("renders every nutshell section in order with matching anchor ids", () => {
    renderWithTheme(<ShortReadsView />);

    const sectionHeadings = screen
      .getAllByRole("heading", { level: 2 })
      .filter((heading) => heading.textContent !== "Contents");

    expect(
      sectionHeadings.map((heading) => [heading.textContent, heading.id]),
    ).toEqual([
      ["Explanation in a nutshell", "explanation"],
      ["Check for understanding in a nutshell", "check-for-understanding"],
      ["Practice in a nutshell", "practice"],
      ["Feedback in a nutshell", "feedback"],
    ]);
  });

  it("renders the images for every section with alt text", () => {
    renderWithTheme(<ShortReadsView />);

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
    images.forEach((image) => {
      expect(image).toHaveAttribute("alt", expect.stringMatching(/.+/));
    });
    expect(
      screen.getAllByRole("heading", {
        level: 3,
        name: "What does this look like in Oak lessons?",
      }),
    ).toHaveLength(5);
  });

  it("renders the feedback form link opening in a new tab", () => {
    renderWithTheme(<ShortReadsView />);

    const feedbackLink = screen.getByRole("link", {
      name: /Fill out a feedback form/,
    });
    expect(feedbackLink).toHaveAttribute(
      "href",
      expect.stringContaining("docs.google.com/forms"),
    );
    expect(feedbackLink).toHaveAttribute("target", "_blank");
    expect(screen.getByText("Share your feedback with us")).toBeInTheDocument();
  });

  it("renders the copyright licence", () => {
    renderWithTheme(<ShortReadsView />);

    expect(
      screen.getByText(/This content is © Oak National Academy Limited/),
    ).toHaveTextContent("2026");
    expect(
      screen.getByRole("link", { name: /Open Government Licence/ }),
    ).toHaveAttribute("target", "_blank");
  });
});
