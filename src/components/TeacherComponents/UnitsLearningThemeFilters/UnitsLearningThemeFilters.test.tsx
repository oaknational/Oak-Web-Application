import { vi } from "vitest";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import UnitsLearningThemeFilters from "./UnitsLearningThemeFilters";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const browseRefined = vi.fn();
vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: unknown[]) => browseRefined(...args),
    },
  }),
}));

describe("UnitsLearningThemeFilters", () => {
  beforeAll(() => {
    // Mock window.history.state
    vi.spyOn(window.history, "state", "get").mockReturnValue({
      url: "https://example.com/some-path",
    });
  });
  test("should render threads with no theme last", async () => {
    renderWithProviders()(
      <UnitsLearningThemeFilters
        labelledBy={"Learning Theme Filter"}
        learningThemes={[
          {
            themeTitle: "No theme 1",
            themeSlug: "no-theme",
          },
          {
            themeTitle: "Algebra",
            themeSlug: "algebra",
          },
          {
            themeTitle: "No theme 2",
            themeSlug: "no-theme",
          },
        ]}
        selectedThemeSlug={"all"}
        linkProps={{
          page: "unit-index",
          programmeSlug: "maths-secondary-ks3",
        }}
        idSuffix="desktop"
        onChangeCallback={vi.fn()}
        programmeSlug="maths-secondary-ks3"
        browseRefined={browseRefined}
      />,
    );
    const themes = await screen.findAllByRole("radio");
    expect(themes[0]).toBe(screen.getByLabelText("All"));
    expect(themes[1]).toBe(screen.getByLabelText("Algebra"));
    expect(themes[2]).toBe(screen.getByLabelText("No theme 1"));
  });
  test("should call callback method with correct value", async () => {
    const onChangeCallback = vi.fn();
    renderWithProviders()(
      <UnitsLearningThemeFilters
        labelledBy={"Learning Theme Filter"}
        learningThemes={[
          {
            themeTitle: "Algebra",
            themeSlug: "algebra",
          },
        ]}
        selectedThemeSlug={"all"}
        linkProps={{
          page: "unit-index",
          programmeSlug: "maths-secondary-ks3",
        }}
        idSuffix="desktop"
        onChangeCallback={onChangeCallback}
        programmeSlug="maths-secondary-ks3"
        browseRefined={browseRefined}
      />,
    );
    const algebraFilter = screen.getByLabelText("Algebra");
    await userEvent.click(algebraFilter);
    expect(onChangeCallback).toHaveBeenCalledWith("algebra");
    const allFilter = screen.getByLabelText("All");
    await userEvent.click(allFilter);
    expect(onChangeCallback).toHaveBeenCalledWith(undefined);
  });
  test("should call tracking browse refined with correct args", async () => {
    renderWithProviders()(
      <UnitsLearningThemeFilters
        programmeSlug="maths-secondary-ks3"
        labelledBy={"Learning Theme Filter"}
        learningThemes={[
          {
            themeTitle: "Grammar",
            themeSlug: "grammar",
          },
        ]}
        idSuffix="desktop"
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
        browseRefined={browseRefined}
        onChangeCallback={vi.fn()}
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

  test("on mobile, invokes setMobileFilter with correct value", async () => {
    const setMobileFilter = vi.fn();
    renderWithProviders()(
      <UnitsLearningThemeFilters
        programmeSlug="maths-secondary-ks3"
        labelledBy={"Learning Theme Filter"}
        learningThemes={[
          {
            themeTitle: "Grammar",
            themeSlug: "grammar",
          },
        ]}
        idSuffix="mobile"
        selectedThemeSlug={"all"}
        setMobileFilter={setMobileFilter}
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
        browseRefined={browseRefined}
        onChangeCallback={vi.fn()}
      />,
    );

    const user = userEvent.setup();
    const grammarThread = screen.getByText("Grammar");
    await user.click(grammarThread);

    expect(setMobileFilter).toHaveBeenCalledWith("grammar");
  });
});
