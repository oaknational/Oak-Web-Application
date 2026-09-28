import { screen } from "@testing-library/dom";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import userEvent from "@testing-library/user-event";

import { MaybeTeachWithOakCard } from "./TeachWithOakCard";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("posthog-js/react", () => ({
  ...jest.requireActual("posthog-js/react"),
  useFeatureFlagVariantKey: jest.fn(),
}));

const mockUseFeatureFlagVariantKey = jest.mocked(useFeatureFlagVariantKey);

const render = renderWithProviders();

const returnTo =
  "/teachers/programmes/maths-secondary-year-7/units/adding-and-subtracting/lessons/adding-integers";

const query = { returnTo, lessonName: "Lesson Name", unitName: "Unit Name" };

const mockTeachWithOakAccessed = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      teachWithOakAccessed: (...args: unknown[]) =>
        mockTeachWithOakAccessed(...args),
    },
  }),
}));

describe("MaybeTeachWithOakCard", () => {
  it("does not render the card when the feature flag is unresolved", () => {
    mockUseFeatureFlagVariantKey.mockReturnValue(undefined);

    render(<MaybeTeachWithOakCard {...query} />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders nothing when the feature flag is on another variant", () => {
    mockUseFeatureFlagVariantKey.mockReturnValue("control");

    render(<MaybeTeachWithOakCard {...query} />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("reads the teachers-teach-with-oak feature flag", () => {
    mockUseFeatureFlagVariantKey.mockReturnValue("teacher-tip");

    render(<MaybeTeachWithOakCard {...query} />);

    expect(mockUseFeatureFlagVariantKey).toHaveBeenCalledWith(
      "teachers-teach-with-oak",
    );
  });

  describe("when the feature flag is on the teacher-tip variant", () => {
    beforeEach(() => {
      mockUseFeatureFlagVariantKey.mockReturnValue("teacher-tip");
    });

    it("renders the card content", () => {
      render(<MaybeTeachWithOakCard {...query} />);

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
      render(<MaybeTeachWithOakCard {...query} />);

      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        `/teachers/teach-with-oak?returnTo=${encodeURIComponent(returnTo)}&lessonName=Lesson+Name&unitName=Unit+Name`,
      );
    });

    it("calls tracking on click", async () => {
      render(<MaybeTeachWithOakCard {...query} />);
      const cardLink = screen.getByRole("link");
      cardLink.addEventListener("click", (e) => e.preventDefault());
      const user = userEvent.setup();
      await user.click(cardLink);
      expect(mockTeachWithOakAccessed).toHaveBeenCalledWith(
        expect.objectContaining({ componentType: "teacher_tip" }),
      );
    });
  });
});
