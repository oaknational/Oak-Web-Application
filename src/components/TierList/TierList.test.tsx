import { screen, waitFor } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import TierList from "./TierList";

jest.mock("../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: jest.fn(),
  }),
}));

describe("TierList", () => {
  it("Renders correct titles ", () => {
    renderWithTheme(
      <TierList
        subjectSlug="maths"
        subjectName="Maths"
        keyStageSlug="ks4"
        keyStageName="Key stage 4"
        tiers={[
          {
            title: "Foundation",
            slug: "foundation",
            unitCount: 3,
            lessonCount: 4,
          },
          {
            title: "Core",
            slug: "core",
            unitCount: 3,
            lessonCount: 4,
          },
          {
            title: "Higher",
            slug: "higher",
            unitCount: 3,
            lessonCount: 4,
          },
        ]}
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
