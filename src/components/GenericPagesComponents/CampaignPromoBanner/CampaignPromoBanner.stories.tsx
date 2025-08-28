import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CampaignPromoBanner } from "./CampaignPromoBanner";
import {
  headingPortableText,
  buttonCtaText,
  bodyPortableText,
} from "./campaignPromoBanner.fixtures";

import { mockImageAsset } from "@/__tests__/__helpers__/cms";

const meta: Meta<typeof CampaignPromoBanner> = {
  component: CampaignPromoBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <div style={{ maxWidth: "1200px", padding: "20px" }}>
          <Story />
        </div>
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CampaignPromoBanner>;

export const Default: Story = {
  args: {
    heading: headingPortableText,
    body: bodyPortableText,
    media: mockImageAsset(),
    buttonCta: buttonCtaText,
  },
};
