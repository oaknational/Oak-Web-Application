import { screen } from "@testing-library/dom";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { MaybeTeachWithOakCard } from "./TeachWithOakCard";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("posthog-js/react", () => ({
  ...jest.requireActual("posthog-js/react"),
  useFeatureFlagVariantKey: jest.fn(),
}));

const mockUseFeatureFlagVariantKey = jest.mocked(useFeatureFlagVariantKey);

const render = renderWithProvidersByName(["theme", "oakTheme"]);

const returnTo =
  "/teachers/programmes/maths-secondary-year-7/units/adding-and-subtracting/lessons/adding-integers";

describe("MaybeTeachWithOakCard", () => {
  it("renders nothing while the feature flag is unresolved", () => {
    mockUseFeatureFlagVariantKey.mockReturnValue(undefined);

    const { container } = render(<MaybeTeachWithOakCard returnTo={returnTo} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the feature flag is on another variant", () => {
    mockUseFeatureFlagVariantKey.mockReturnValue("control");

    const { container } = render(<MaybeTeachWithOakCard returnTo={returnTo} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("reads the teachers-teach-with-oak feature flag", () => {
    mockUseFeatureFlagVariantKey.mockReturnValue("teacher-tip");

    render(<MaybeTeachWithOakCard returnTo={returnTo} />);

    expect(mockUseFeatureFlagVariantKey).toHaveBeenCalledWith(
      "teachers-teach-with-oak",
    );
  });

  describe("when the feature flag is on the teacher-tip variant", () => {
    beforeEach(() => {
      mockUseFeatureFlagVariantKey.mockReturnValue("teacher-tip");
    });

    it("renders the card content", () => {
      render(<MaybeTeachWithOakCard returnTo={returnTo} />);

      expect(
        screen.getByText(
          "Ever wondered why our lessons are structured this way?",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText("See the thinking behind Oak lessons"),
      ).toBeInTheDocument();
    });

    it("links to the teach with oak page, returning to the given path", () => {
      render(<MaybeTeachWithOakCard returnTo={returnTo} />);

      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        `/teachers/teach-with-oak?returnTo=${encodeURIComponent(returnTo)}`,
      );
    });
  });
});
