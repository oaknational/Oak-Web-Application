import { screen, waitFor } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import SummaryCard from "./SummaryCard";

describe("CardLinkIcon", () => {
  it("Renders correct title ", async () => {
    renderWithTheme(
      <SummaryCard
        title={"title"}
        heading={"heading"}
        summary={"text"}
        imageProps={{
          src: "/images/illustrations/planning.png",
          alt: "planning illustration",
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "title"
      );
    });
  });
});
