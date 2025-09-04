import { CampaignPage } from "@/common-lib/cms-types/campaignPage";
import { mockImageAsset } from "@/__tests__/__helpers__/cms";
import {
  bodyPortableText,
  headingPortableText,
} from "@/fixtures/campaign/portableText";

const mockCampaign: CampaignPage = {
  id: "test-id",
  content: [
    {
      headingPortableTextWithPromo: [],
      type: "CampaignIntro",
      bodyPortableTextWithPromo: bodyPortableText("campaign-intro-body-text"),
    },
    {
      headingPortableTextWithPromo: headingPortableText(
        "campaign-promo-heading-text",
      ),
      type: "CampaignPromoBanner",
      media: [{ ...mockImageAsset(), altText: "campaign-promo-test" }],
    },
    {
      type: "NewsletterSignUp",
      heading: "newsletter-sign-up-heading-text",
      bodyPortableText: bodyPortableText("newsletter-sign-up-body-text"),
      buttonCta: "newsletter-signup-cta-button",
      formId: "hubspot-test-form-id",
    },
  ],
  header: {
    image: { ...mockImageAsset(), altText: "Test Image Alt Text" },
    heading: "Test Campaign Header",
  },
  slug: "test-campaign",
  title: "Test Campaign",
  seo: {
    title: "Test Campaign SEO Title",
    description: "Test Campaign SEO Description",
  },
};

export default mockCampaign;
