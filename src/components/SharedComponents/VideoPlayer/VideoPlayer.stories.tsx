import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { OakGrid, OakGridArea } from "@oak-academy/oak-components";

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
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <OakGrid>
    <OakGridArea $colSpan={[12, 6, 6]}>
      <Component {...args} />
    </OakGridArea>
  </OakGrid>
);

export const VideoPlayer = Template.bind({});
VideoPlayer.args = {};
