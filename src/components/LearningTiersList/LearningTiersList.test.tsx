import { screen, waitFor } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LearningTiersList from "./LearningTiersList";

describe("LearningTiersList", () => {
  it("Renders correct titles ", () => {
    renderWithTheme(
      <LearningTiersList
        tiers={[
          { title: "Foundation", numberUnits: 3, numberLessons: 4 },
          { title: "Core", numberUnits: 3, numberLessons: 4 },
          { title: "Higher", numberUnits: 3, numberLessons: 4 },
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
