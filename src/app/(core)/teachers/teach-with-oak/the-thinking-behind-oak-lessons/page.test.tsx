import { screen, within } from "@testing-library/react";
import { useFeatureFlagEnabled } from "posthog-js/react";

import ShortReadsPage from "./page";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("@/utils/featureFlags");

jest.unmock("next/navigation");

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn(),
}));

const mockUseFeatureFlagEnabled = jest.mocked(useFeatureFlagEnabled);

describe("The thinking behind Oak lessons page", () => {
  describe("feature flags", () => {
    it("does not render when the feature flag is disabled", () => {
      mockUseFeatureFlagEnabled.mockReturnValue(false);
      expect(() => render(<ShortReadsPage />)).toThrow();
    });

    it("does not render while the feature flag is still loading", () => {
      mockUseFeatureFlagEnabled.mockReturnValue(
        undefined as unknown as boolean,
      );
      expect(() => render(<ShortReadsPage />)).toThrow();
    });

    it("renders when the feature flag is enabled", () => {
      mockUseFeatureFlagEnabled.mockReturnValue(true);
      expect(() => render(<ShortReadsPage />)).not.toThrow();
    });
  });

  describe("page content", () => {
    beforeEach(() => {
      mockUseFeatureFlagEnabled.mockReturnValue(true);
    });

    it("renders the thinking behind Oak lessons page", () => {
      render(<ShortReadsPage />);

      [
        "The thinking behind Oak lessons",
        "Explanation in a nutshell",
        "Practice in a nutshell",
        "Feedback in a nutshell",
      ].forEach((heading) => {
        expect(
          screen.getByRole("heading", { name: heading }),
        ).toBeInTheDocument();
      });
      expect(
        screen.getByRole("navigation", { name: "Contents" }),
      ).toBeVisible();
    });

    it("provides a matching section for every contents link", () => {
      render(<ShortReadsPage />);

      const contents = screen.getByRole("navigation", { name: "Contents" });

      within(contents)
        .getAllByRole("link")
        .forEach((link) => {
          const href = link.getAttribute("href");

          expect(href).toMatch(/^#.+/);
          expect(document.getElementById(href!.slice(1))).toBeInTheDocument();
        });
    });

    it("links to the teach with oak page and shows the current page as non-clickable text", () => {
      render(<ShortReadsPage />);

      const breadcrumbs = within(
        screen.getByRole("navigation", { name: "Breadcrumb" }),
      );

      expect(
        breadcrumbs.getByRole("link", { name: "Teach with Oak" }),
      ).toHaveAttribute("href", "/teachers/teach-with-oak");

      expect(
        breadcrumbs.getByText("The thinking behind Oak lessons"),
      ).toHaveAttribute("aria-current", "page");

      expect(
        breadcrumbs.queryByRole("link", {
          name: "The thinking behind Oak lessons",
        }),
      ).not.toBeInTheDocument();
    });
  });
});
