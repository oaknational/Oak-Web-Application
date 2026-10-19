import { screen } from "@testing-library/react";

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

  it("renders breadcrumbs", () => {
    render(<ShortReadsPage />);
    const breadcrumbs = [
      { label: "Teach With Oak", href: "/teachers/teach-with-oak" },
      {
        label: "The thinking behind Oak lessons",
        href: "/teachers/teach-with-oak/short-reads",
      },
    ];
    expect(breadcrumbs).toBeDefined();
  });
});
