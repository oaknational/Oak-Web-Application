import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { CampaignPageHeader } from "./CampaignPageHeader";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockImageAsset } from "@/__tests__/__helpers__/cms";

const render = renderWithProviders();

const mockCampaignHeader = {
  heading: "Test Campaign Header",
  image: mockImageAsset(),
};

const setSearchTerm = jest.fn();
jest.mock("@/context/Search/useSearch", () => ({
  __esModule: true,
  default: () => ({
    setSearchTerm,
  }),
}));

describe("CampaignHeader", () => {
  it("renders a heading", () => {
    render(<CampaignPageHeader campaignHeader={mockCampaignHeader} />);
    const heading = screen.getByRole("heading", {
      name: "Test Campaign Header",
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders search bar", () => {
    render(<CampaignPageHeader campaignHeader={mockCampaignHeader} />);
    const searchInput = screen.getByPlaceholderText(
      "Search by keyword or topic",
    );
    expect(searchInput).toBeInTheDocument();
  });
  it("renders a subheading if provided", () => {
    render(
      <CampaignPageHeader
        campaignHeader={{
          ...mockCampaignHeader,
          subheading: "This is a subheading",
        }}
      />,
    );
    const subheading = screen.getByText("This is a subheading");
    expect(subheading).toBeInTheDocument();
  });
  it("calls setSearchTerm when a search is performed", async () => {
    render(<CampaignPageHeader campaignHeader={mockCampaignHeader} />);
    const searchInput = screen.getByPlaceholderText(
      "Search by keyword or topic",
    );
    const user = userEvent.setup();
    await user.type(searchInput, "test search{enter}");
    await waitFor(() =>
      expect(setSearchTerm).toHaveBeenCalledWith({ searchTerm: "test search" }),
    );
  });
  it("does not render keystage buttons or search bar when hideKsSelector set", () => {
    render(
      <CampaignPageHeader
        campaignHeader={{ ...mockCampaignHeader, hideKsSelector: true }}
      />,
    );

    const keystageButtons = screen.queryByRole("link");
    expect(keystageButtons).not.toBeInTheDocument();

    const searchInput = screen.queryByPlaceholderText(
      "Search by keyword or topic",
    );
    expect(searchInput).not.toBeInTheDocument();
  });
});
