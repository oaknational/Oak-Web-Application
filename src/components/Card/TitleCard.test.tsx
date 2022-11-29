import { screen, waitFor } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import TitleCard from "./TitleCard";

describe("Subject title card", () => {
  it("Renders correct title ", () => {
    renderWithTheme(
      <TitleCard
        title="Computer Science"
        keyStage="key Stage 4"
        keyStageSlug="key-stage-1"
        iconName="Twitter"
        background="teachersHighlight"
      />
    );

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Computer Science"
      );
    });
  });
});
