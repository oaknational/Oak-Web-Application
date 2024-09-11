import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import UnitsLearningThemeFilters from "./UnitsLearningThemeFilters";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

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
  test("should call tracking browse refined with correct args", async () => {
    renderWithTheme(
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

    const grammarThread = screen.getByRole("link", { name: "Grammar" });
    screen.debug(grammarThread);
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
  test("skip units button becomes visible when focussed", async () => {
    const { getByText } = renderWithTheme(
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

    const skipUnits = getByText("Skip to units").closest("a");

    if (!skipUnits) {
      throw new Error("Could not find filter button");
    }

    act(() => {
      skipUnits.focus();
    });
    expect(skipUnits).toHaveFocus();
    expect(skipUnits).not.toHaveStyle("position: absolute");

    act(() => {
      skipUnits.blur();
    });
    expect(skipUnits).not.toHaveFocus();
  });
});
