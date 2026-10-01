import userEvent from "@testing-library/user-event";

import SearchBar from "./SearchBar";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  setupMockLinkClick,
  teardownMockLinkClick,
} from "@/utils/mockLinkClick";

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
    setupMockLinkClick();
  });

  afterEach(() => {
    teardownMockLinkClick();
  });

  it("does not track searchJourneyInitiated on render", () => {
    render(<SearchBar />);

    expect(searchJourneyInitiated).not.toHaveBeenCalled();
  });

  it("tracks searchJourneyInitiated when the search link is clicked", async () => {
    const { getByRole } = render(<SearchBar />);
    const user = userEvent.setup();

    await user.click(getByRole("link", { name: "Search" }));

    expect(searchJourneyInitiated).toHaveBeenCalledTimes(1);
    expect(searchJourneyInitiated).toHaveBeenCalledWith({
      accessLevel: "search",
      navigationType: "narrow",
      context: "search",
      searchSource: "top nav",
    });
  });
});
