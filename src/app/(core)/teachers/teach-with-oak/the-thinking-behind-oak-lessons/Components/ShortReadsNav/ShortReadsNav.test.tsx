import { screen, within } from "@testing-library/react";

import { ShortReadsNav } from "./ShortReadsNav";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const expectedLinks = [
  ["Explanation", "#explanation"],
  ["Check for understanding", "#check-for-understanding"],
  ["Practice", "#practice"],
  ["Feedback", "#feedback"],
];

describe("ShortReadsNav", () => {
  it("renders separate mobile and desktop contents navs with unique heading ids", () => {
    renderWithTheme(<ShortReadsNav />);

    const headings = screen.getAllByRole("heading", {
      level: 2,
      name: "Contents",
      hidden: true,
    });
    expect(headings.map((h) => h.id)).toEqual([
      "short-read-contents-mobile",
      "short-read-contents",
    ]);
  });

  it("labels each nav by its heading and links to every section", () => {
    renderWithTheme(<ShortReadsNav />);

    const navs = screen.getAllByRole("navigation", {
      name: "Contents",
      hidden: true,
    });
    expect(navs).toHaveLength(2);

    navs.forEach((nav) => {
      const links = within(nav).getAllByRole("link", { hidden: true });
      expect(
        links.map((link) => [link.textContent, link.getAttribute("href")]),
      ).toEqual(
        expectedLinks.map(([title, href]) => [
          expect.stringContaining(title!),
          href,
        ]),
      );
    });
  });
});
