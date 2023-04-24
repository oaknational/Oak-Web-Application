import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import LearningThemeFilters from "./LearningThemeFilters";

jest.mock("../../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: jest.fn(),
  }),
}));

describe("PostCategoryList", () => {
  test("should render links to lessons", () => {
    const { getByRole } = renderWithTheme(
      <LearningThemeFilters
        labelledBy={"Learning Theme Filter"}
        learningThemes={[
          {
            learningThemeTitle: "Grammar",
            learningThemeSlug: "grammar",
          },
        ]}
        selectedThemeSlug={"all"}
        linkProps={{
          page: "unit-index",
          programme: "maths-secondary-ks3",
        }}
        trackingProps={{
          keyStageSlug: "ks3",
          keyStageTitle: "Key stage 3",
          subjectSlug: "english",
          subjectTitle: "English",
        }}
      />
    );
    expect(getByRole("link", { name: "Grammar" })).toHaveAttribute(
      "href",
      "/beta/teachers/programmes/maths-secondary-ks3/units?learning-theme=grammar"
    );
  });
});
