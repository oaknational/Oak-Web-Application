import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";

import { CampaignPageHeader } from "./CampaignPageHeader";

import { mockImageAsset } from "@/__tests__/__helpers__/cms";

const meta: Meta<typeof CampaignPageHeader> = {
  component: CampaignPageHeader,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof CampaignPageHeader>;

export const Default: Story = {
  render: () => (
    <CampaignPageHeader
      campaignHeader={{
        heading: "Campaign Header",
        image: mockImageAsset(),
      }}
    />
  ),
};

export const WithSubheading: Story = {
  render: () => (
    <CampaignPageHeader
      campaignHeader={{
        heading: "Campaign Header",
        subheading: "This is a subheading",
        image: mockImageAsset(),
      }}
    />
  ),
};
