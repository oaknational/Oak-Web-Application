import { CampaignPromoBanner } from "./CampaignPromoBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockImageAsset } from "@/__tests__/__helpers__/cms";
import {
  bodyPortableText,
  headingPortableText,
  subheadingPortableText,
} from "@/fixtures/campaign/portableText";
import { campaignTextStyles } from "@/pages/campaigns/[campaignSlug]";

const render = renderWithProviders();

jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(),
}));

describe("CampaignPromoBanner", () => {
  it("should render the heading", () => {
    const { getByRole } = render(
      <CampaignPromoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        media={mockImageAsset()}
      />,
    );

    const heading = getByRole("heading");
    expect(heading).toBeInTheDocument();

    const headingText = headingPortableText()[0]?.children[0]?.text;
    if (!headingText) throw new Error("No heading text found in fixture");
    expect(heading).toHaveTextContent(headingText);
  });

  it("should render the image", async () => {
    const { getByAltText } = render(
      <CampaignPromoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        media={{ ...mockImageAsset(), altText: "test" }}
      />,
    );

    const image = getByAltText("test");

    expect(image).toBeInTheDocument();
  });

  it("should render subheading when provided", () => {
    const { getByRole } = render(
      <CampaignPromoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        media={mockImageAsset()}
        subheading={subheadingPortableText()}
      />,
    );

    const subheading = getByRole("heading", { level: 3 });
    expect(subheading).toBeInTheDocument();
  });

  it("should render body text when provided", () => {
    const { getByText } = render(
      <CampaignPromoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        media={mockImageAsset()}
        body={bodyPortableText()}
      />,
    );

    const bodyText = bodyPortableText()[0]?.children[0]?.text;

    const body = getByText(bodyText);
    expect(body).toBeInTheDocument();
  });

  it("should render CTA button when provided", async () => {
    const { getByText } = render(
      <CampaignPromoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        media={mockImageAsset()}
        buttonCta={"buttonCtaText"}
      />,
    );

    const button = getByText("buttonCtaText").closest("a");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("buttonCtaText");
  });

  it("should not render optional props when not provided", () => {
    const { queryByText, queryByRole } = render(
      <CampaignPromoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        media={mockImageAsset()}
      />,
    );

    const subheading = queryByText(
      subheadingPortableText()[0]?.children[0]?.text || "",
    );
    expect(subheading).not.toBeInTheDocument();

    const body = queryByText(bodyPortableText()[0]?.children[0]?.text || "");
    expect(body).not.toBeInTheDocument();

    const button = queryByRole("button", { name: "buttonCtaText" });
    expect(button).not.toBeInTheDocument();
  });
});
