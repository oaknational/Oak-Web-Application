import { screen } from "@testing-library/react";

import CardLinkIcon from "./CardLinkIcon";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CardLinkIcon", () => {
  it("is a link, passes href", () => {
    renderWithTheme(
      <CardLinkIcon
        title={"Plan a lesson"}
        titleTag={"h4"}
        background="mint"
        page={null}
        href={"/planning"}
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/planning");
  });
  it("is a link, resolves page -> href", () => {
    renderWithTheme(
      <CardLinkIcon
        title={"Plan a lesson"}
        titleTag={"h4"}
        background="mint"
        page="about-board"
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/about-us/board");
  });
  it("Renders correct title ", () => {
    renderWithTheme(
      <CardLinkIcon
        title={"Plan a lesson"}
        titleTag={"h4"}
        background="mint"
        page={"contact"}
      />,
    );

    expect(screen.getByRole("heading", { level: 4 }).textContent).toBe(
      "Plan a lesson",
    );
  });
});
