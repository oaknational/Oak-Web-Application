import { screen, waitFor } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LearningTiersList from "./LearningTiersList";

describe("LearningTiersList", () => {
  it("Renders correct titles ", () => {
    renderWithTheme(
      <LearningTiersList
        tiers={[
          { title: "Foundation", unitCount: 3, lessonCount: 4 },
          { title: "Core", unitCount: 3, lessonCount: 4 },
          { title: "Higher", unitCount: 3, lessonCount: 4 },
        ]}
        background="teachersYellow"
      />
    );

    waitFor(() => {
      expect(screen.getAllByRole("heading", { level: 3 })[0]?.textContent).toBe(
        "Foundation"
      );
      expect(screen.getAllByRole("heading", { level: 3 })[1]?.textContent).toBe(
        "Core"
      );
      expect(screen.getAllByRole("heading", { level: 3 })[2]?.textContent).toBe(
        "Higher"
      );
    });
  });
});
