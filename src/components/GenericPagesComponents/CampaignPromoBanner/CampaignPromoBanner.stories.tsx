import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CampaignPromoBanner } from "./CampaignPromoBanner";

import { mockImageAsset } from "@/__tests__/__helpers__/cms";
import {
  bodyPortableText,
  headingPortableText,
  subheadingPortableText,
} from "@/fixtures/campaign/portableText";
import { campaignTextStyles } from "@/pages/campaigns/[campaignSlug]";

const meta: Meta<typeof CampaignPromoBanner> = {
  component: CampaignPromoBanner,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CampaignPromoBanner>;

export const Default: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <CampaignPromoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        subheading={subheadingPortableText()}
        buttonCta={"buttonCtaText"}
        media={mockImageAsset()}
      />
    </OakThemeProvider>
  ),
};

export const WithBodyText: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <CampaignPromoBanner
        textStyles={campaignTextStyles}
        heading={headingPortableText()}
        subheading={subheadingPortableText()}
        body={bodyPortableText()}
        buttonCta={"buttonCtaText"}
        media={mockImageAsset()}
      />
    </OakThemeProvider>
  ),
};
