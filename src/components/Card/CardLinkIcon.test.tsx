import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import CardLinkIcon from "./CardLinkIcon";

describe("CardLinkIcon", () => {
  it("is a link, passes href", () => {
    renderWithTheme(
      <CardLinkIcon
        title={"Plan a lesson"}
        titleTag={"h4"}
        background="pupilsLimeGreen"
        page={null}
        href={"/planning"}
      />
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/planning");
  });
  it("is a link, resolves page -> href", () => {
    renderWithTheme(
      <CardLinkIcon
        title={"Plan a lesson"}
        titleTag={"h4"}
        background="pupilsLimeGreen"
        page="about-board"
      />
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/about-us/board");
  });
  it("Renders correct title ", () => {
    renderWithTheme(
      <CardLinkIcon
        title={"Plan a lesson"}
        titleTag={"h4"}
        background="pupilsLimeGreen"
        page={"contact"}
      />
    );

    expect(screen.getByRole("heading", { level: 4 }).textContent).toBe(
      "Plan a lesson"
    );
  });
});
