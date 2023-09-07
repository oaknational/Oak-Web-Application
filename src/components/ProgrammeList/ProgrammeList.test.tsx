import { screen, waitFor } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import { tieredProgrammeListingFixture } from "../../node-lib/curriculum-api/fixtures/tierListing.fixture";

import ProgrammeList from "./ProgrammeList";

jest.mock("../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: jest.fn(),
  }),
}));

describe("ProgrammeList", () => {
  it("Renders correct titles ", () => {
    renderWithTheme(<ProgrammeList {...tieredProgrammeListingFixture()} />);

    waitFor(() => {
      expect(screen.getAllByRole("heading", { level: 3 })[0]?.textContent).toBe(
        "Foundation",
      );
      expect(screen.getAllByRole("heading", { level: 3 })[1]?.textContent).toBe(
        "Core",
      );
      expect(screen.getAllByRole("heading", { level: 3 })[2]?.textContent).toBe(
        "Higher",
      );
    });
  });
});
