import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import CardLinkIcon from "./CardLinkIcon";

describe("CardLinkIcon", () => {
  it("is a link", async () => {
    renderWithProviders(
      <CardLinkIcon
        title={"Plan a lesson"}
        titleTag={"h4"}
        background="pupilsLimeGreen"
        href={"/planning"}
      />
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/planning");
  });
  it("Renders correct title ", async () => {
    renderWithProviders(
      <CardLinkIcon
        title={"Plan a lesson"}
        titleTag={"h4"}
        background="pupilsLimeGreen"
        href={"/planning"}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 4 }).textContent).toBe(
        "Plan a lesson"
      );
    });
  });
});
