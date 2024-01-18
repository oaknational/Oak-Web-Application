import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";

import TitleCard from "./SubjectUnitLessonTitleCard";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Subject title card", () => {
  it("Renders correct title ", () => {
    renderWithTheme(
      <TitleCard
        page={"lesson"}
        title="Computer Science"
        keyStage="key Stage 4"
        keyStageSlug="key-stage-1"
        subject="Computing"
        subjectSlug="computing"
      />,
    );

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Computer Science",
      );
    });
  });
});
