import { CampaignVideoBanner } from "./CampaignVideoBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockVideoAsset } from "@/__tests__/__helpers__/cms";
import { headingPortableText } from "@/fixtures/campaign/portableText";
import { campaignTextStyles } from "@/pages/campaigns/[campaignSlug]";

const render = renderWithProviders();

jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(),
}));

describe("CampaignVideoBanner", () => {
  it("should render the heading", () => {
    const { getByRole } = render(
      <CampaignVideoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        video={mockVideoAsset()}
      />,
    );

    const heading = getByRole("heading");
    expect(heading).toBeInTheDocument();

    const headingText = headingPortableText()[0]?.children[0]?.text;
    if (!headingText) throw new Error("No heading text found in fixture");
    expect(heading).toHaveTextContent(headingText);
  });
});
