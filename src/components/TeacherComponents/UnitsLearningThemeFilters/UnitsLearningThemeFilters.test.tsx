import { screen, waitFor } from "@testing-library/dom";
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

const setTheme = jest.fn();

describe("UnitsLearningThemeFilters", () => {
  beforeAll(() => {
    // Mock window.history.state
    jest.spyOn(window.history, "state", "get").mockReturnValue({
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
        idSuffix="desktop"
        setTheme={jest.fn()}
      />,
    );
    const themes = await screen.findAllByRole("radio");
    expect(themes[0]).toBe(screen.getByLabelText("All"));
    expect(themes[1]).toBe(screen.getByLabelText("Algebra"));
    expect(themes[2]).toBe(screen.getByLabelText("No theme 1"));
  });
  test("should call setTheme method with correct value", async () => {
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
        idSuffix="desktop"
        setTheme={setTheme}
      />,
    );
    const algebraFilter = screen.getByLabelText("Algebra");
    await userEvent.click(algebraFilter);
    expect(setTheme).toHaveBeenCalledWith("algebra");
  });

  test("on mobile, invokes setMobileFilter with correct value", async () => {
    renderWithProviders()(
      <UnitsLearningThemeFilters
        labelledBy={"Learning Theme Filter"}
        learningThemes={[
          {
            themeTitle: "Grammar",
            themeSlug: "grammar",
          },
        ]}
        idSuffix="mobile"
        selectedThemeSlug={"all"}
        setTheme={setTheme}
      />,
    );

    const user = userEvent.setup();
    const grammarThread = screen.getByText("Grammar");
    await user.click(grammarThread);

    await waitFor(() => expect(setTheme).toHaveBeenCalledWith("grammar"));
  });
});
