import UnitsLearningThemeFilters from "./UnitsLearningThemeFilters";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: jest.fn(),
  }),
}));

describe("UnitsLearningThemeFilters", () => {
  test("should render links to lessons", () => {
    const { getByRole } = renderWithTheme(
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
    expect(getByRole("link", { name: "Grammar" })).toHaveAttribute(
      "href",
      "/teachers/programmes/maths-secondary-ks3/units?learning-theme=grammar",
    );
  });
});
