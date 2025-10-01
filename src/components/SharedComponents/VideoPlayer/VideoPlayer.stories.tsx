import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  component: Component,
  decorators: [AnalyticsDecorator],
  argTypes: {
    playbackId: {
      defaultValue: "wgjCIRWRr00OSum34AWeU87lmSSCtNjEOViD9X5YSG8k",
    },
    title: {
      defaultValue: "Test video",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <OakGrid>
    <OakGridArea $colSpan={[12, 6, 6]}>
      <Component {...args} />
    </OakGridArea>
  </OakGrid>
);

export const VideoPlayer = {
  render: Template,
  args: {},
};
