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
            keyStageSlug: "ks3",
            keyStageTitle: "Key Stage 3",
            subjectSlug: "english",
            subjectTitle: "English",
            tierSlug: "core",
            slug: "grammar",
            label: "Grammar",
            tierName: "Core",
          },
        ]}
        selectedThemeSlug={"all"}
        linkProps={{
          page: "unit-index",
          keyStage: "ks3",
          subject: "english",
          search: { ["tier"]: "core" },
        }}
        trackingProps={{
          keyStageSlug: "ks3",
          keyStageName: "Key Stage 3",
          subjectSlug: "english",
          subjectName: "English",
        }}
      />
    );
    expect(getByRole("link", { name: "Grammar" })).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/ks3/subjects/english/units?tier=core&learning-theme=grammar"
    );
  });
});
