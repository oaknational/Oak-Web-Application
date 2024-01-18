import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";

import SummaryCard from "./SummaryCard";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CardLinkIcon", () => {
  it("Renders correct title ", async () => {
    renderWithTheme(
      <SummaryCard
        title={"title"}
        heading={"heading"}
        summaryPortableText={"text"}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "title",
      );
    });
  });
});
