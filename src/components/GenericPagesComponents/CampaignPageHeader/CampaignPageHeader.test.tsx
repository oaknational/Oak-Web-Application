import { screen } from "@testing-library/dom";

import { CampaignPageHeader } from "./CampaignPageHeader";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockImageAsset } from "@/__tests__/__helpers__/cms";
import keyStagesFixture from "@/node-lib/curriculum-api-2023/fixtures/keyStages.fixture";

const render = renderWithProviders();

const mockCampaignHeader = {
  heading: "Test Campaign Header",
  image: mockImageAsset(),
};

describe("CampaignHeader", () => {
  it("renders a heading", () => {
    render(
      <CampaignPageHeader
        campaignHeader={mockCampaignHeader}
        keyStages={keyStagesFixture()}
      />,
    );
    const heading = screen.getByRole("heading", {
      name: "Test Campaign Header",
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders keystage buttons", () => {
    render(
      <CampaignPageHeader
        campaignHeader={mockCampaignHeader}
        keyStages={keyStagesFixture()}
      />,
    );
    const keystageButtons = screen.getAllByRole("link");
    const ks1Button = keystageButtons[1];
    expect(ks1Button).toBeInTheDocument();
    const href = ks1Button?.getAttribute("href");
    expect(href).toBe("/teachers/key-stages/ks1/subjects");
  });
  it("renders search bar", () => {
    render(
      <CampaignPageHeader
        campaignHeader={mockCampaignHeader}
        keyStages={keyStagesFixture()}
      />,
    );
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
        keyStages={keyStagesFixture()}
      />,
    );
    const subheading = screen.getByText("This is a subheading");
    expect(subheading).toBeInTheDocument();
  });
});
