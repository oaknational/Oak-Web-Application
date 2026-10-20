import { screen, within } from "@testing-library/react";

import ShortReadsPage from "./page";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("The thinking behind Oak lessons page", () => {
  it("renders the thinking behind Oak lessons page", () => {
    render(<ShortReadsPage />);

    [
      "The thinking behind Oak lessons",
      "Explanation in a nutshell",
      "What?",
      "Why?",
    ].forEach((heading) => {
      expect(
        screen.getByRole("heading", { name: heading }),
      ).toBeInTheDocument();
    });
    expect(screen.getByRole("navigation", { name: "Contents" })).toBeVisible();
  });

  it("renders breadcrumbs with a link back to Teach With Oak", () => {
    render(<ShortReadsPage />);

    expect(
      screen.getByRole("link", { name: "Teach With Oak" }),
    ).toHaveAttribute("href", "/teachers/teach-with-oak");

    expect(
      screen.queryByRole("text", {
        name: "The thinking behind Oak lessons",
      }),
    ).not.toBeInTheDocument();
  });

  it("provides a matching section for every contents link", () => {
    render(<ShortReadsPage />);

    const contents = screen.getByRole("navigation", { name: "Contents" });

    within(contents)
      .getAllByRole("link")
      .forEach((link) => {
        const href = link.getAttribute("href");

        expect(href).toMatch(/^#.+/);
        expect(document.getElementById(href!.slice(1))).toBeInTheDocument();
      });
  });
});
