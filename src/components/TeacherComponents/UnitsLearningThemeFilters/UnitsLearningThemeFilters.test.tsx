import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import UnitsLearningThemeFilters from "./UnitsLearningThemeFilters";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const browseRefined = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: unknown[]) => browseRefined(...args),
    },
  }),
}));

describe("UnitsLearningThemeFilters", () => {
  test("should call tracking browse refined with correct args", async () => {
    renderWithProviders()(
      <UnitsLearningThemeFilters
        labelledBy={"Learning Theme Filter"}
        learningThemes={[
          {
            themeTitle: "Grammar",
            themeSlug: "grammar",
          },
        ]}
        selectedThemeSlug={"all"}
        linkProps={{
          page: "unit-index",
          programmeSlug: "maths-secondary-ks3",
        }}
        trackingProps={{
          keyStageSlug: "ks3",
          keyStageTitle: "Key stage 3",
          subjectSlug: "english",
          subjectTitle: "English",
        }}
      />,
    );

    const grammarThread = await screen.findByText("Grammar");
    await userEvent.click(grammarThread);
    expect(browseRefined).toHaveBeenCalledWith({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "filter_link",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      filterType: "Learning theme filter",
      filterValue: "Grammar",
      activeFilters: { keyStage: ["ks3"], subject: ["english"] },
    });
  });
});
