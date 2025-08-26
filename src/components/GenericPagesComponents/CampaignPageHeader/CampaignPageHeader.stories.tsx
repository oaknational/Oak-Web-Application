import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

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
    <OakThemeProvider theme={oakDefaultTheme}>
      <CampaignPageHeader
        campaignHeader={{
          heading: "Campaign Header",
          image: mockImageAsset(),
        }}
        keyStages={{
          keyStages: [
            {
              title: "Key Stage 1",
              shortCode: "KS1",
              slug: "ks1",
              displayOrder: 1,
            },
            {
              title: "Key Stage 2",
              shortCode: "KS2",
              slug: "ks2",
              displayOrder: 2,
            },
            {
              title: "Key Stage 3",
              shortCode: "KS3",
              slug: "ks3",
              displayOrder: 3,
            },
            {
              title: "Key Stage 4",
              shortCode: "KS4",
              slug: "ks4",
              displayOrder: 4,
            },
            {
              title: "EYFS",
              shortCode: "EYFS",
              slug: "eyfs",
              displayOrder: 5,
            },
          ],
        }}
      />
    </OakThemeProvider>
  ),
};
