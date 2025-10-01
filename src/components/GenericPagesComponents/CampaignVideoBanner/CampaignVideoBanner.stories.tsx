import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CampaignVideoBanner } from "./CampaignVideoBanner";

import { mockVideoAsset } from "@/__tests__/__helpers__/cms";
import {
  headingPortableText,
  subheadingPortableText,
} from "@/fixtures/campaign/portableText";

const meta: Meta<typeof CampaignVideoBanner> = {
  component: CampaignVideoBanner,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CampaignVideoBanner>;

export const Default: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <CampaignVideoBanner
        heading={headingPortableText()}
        subheading={subheadingPortableText()}
        video={mockVideoAsset()}
      />
    </OakThemeProvider>
  ),
};
