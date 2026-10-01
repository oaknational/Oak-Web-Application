import userEvent from "@testing-library/user-event";

import SearchBar from "./SearchBar";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const searchJourneyInitiated = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      searchJourneyInitiated: (...args: unknown[]) =>
        searchJourneyInitiated(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("<SearchBar />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not track searchJourneyInitiated on render", () => {
    render(<SearchBar />);

    expect(searchJourneyInitiated).not.toHaveBeenCalled();
  });

  it("tracks searchJourneyInitiated when the search is submitted", async () => {
    const { getByRole } = render(<SearchBar />);
    const user = userEvent.setup();
    // The desktop form is display:none
    const submit = getByRole("button", {
      name: "Submit search",
      hidden: true,
    });
    // Prevent a navigation caused by the form submission
    submit.closest("form")?.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    await user.click(submit);

    expect(searchJourneyInitiated).toHaveBeenCalledTimes(1);
    expect(searchJourneyInitiated).toHaveBeenCalledWith({
      accessLevel: "search",
      navigationType: "narrow",
      context: "search",
      searchSource: "top nav",
    });
  });
});
