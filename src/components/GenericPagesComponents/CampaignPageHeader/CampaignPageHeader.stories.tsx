import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CampaignPageHeader } from "./CampaignPageHeader";

import { mockImageAsset } from "@/__tests__/__helpers__/cms";
import keyStagesFixture from "@/node-lib/curriculum-api-2023/fixtures/keyStages.fixture";

const meta: Meta<typeof CampaignPageHeader> = {
  component: CampaignPageHeader,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof CampaignPageHeader>;

export const Default: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <CampaignPageHeader
        campaignHeader={{
          heading: "Campaign Header",
          image: mockImageAsset(),
        }}
        keyStages={keyStagesFixture()}
      />
    </OakThemeProvider>
  ),
};

export const WithSubheading: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <CampaignPageHeader
        campaignHeader={{
          heading: "Campaign Header",
          subheading: "This is a subheading",
          image: mockImageAsset(),
        }}
        keyStages={keyStagesFixture()}
      />
    </OakThemeProvider>
  ),
};
