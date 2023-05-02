import { screen, waitFor } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import tierListingFixture from "../../node-lib/curriculum-api/fixtures/tierListing.fixture";

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
        slug="maths"
        title="Maths"
        keyStageSlug="ks4"
        keyStageTitle="Key stage 4"
        programmes={tierListingFixture().programmes}
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
