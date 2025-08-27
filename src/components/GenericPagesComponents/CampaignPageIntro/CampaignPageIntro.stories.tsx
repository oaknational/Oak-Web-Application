import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CampaignPageIntro } from "./CampaignPageIntro";
import {
  headingPortableText,
  bodyPortableTextWithStyling,
} from "./campaignPageIntro.fixtures";

const meta: Meta<typeof CampaignPageIntro> = {
  component: CampaignPageIntro,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof CampaignPageIntro>;

export const Default: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <CampaignPageIntro
        heading={headingPortableText}
        body={bodyPortableTextWithStyling}
      />
    </OakThemeProvider>
  ),
};
