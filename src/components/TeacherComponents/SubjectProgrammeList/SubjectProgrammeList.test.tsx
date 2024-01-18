import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";

import SubjectProgrammeList from "./SubjectProgrammeList";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { tieredProgrammeListingFixture } from "@/node-lib/curriculum-api/fixtures/tierListing.fixture";

vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: vi.fn(),
  }),
}));

describe("SubjectProgrammeList", () => {
  it("Renders correct titles ", () => {
    renderWithTheme(
      <SubjectProgrammeList {...tieredProgrammeListingFixture()} />,
    );

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
