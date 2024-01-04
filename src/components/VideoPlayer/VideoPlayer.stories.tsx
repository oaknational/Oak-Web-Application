import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import GridArea from "../Grid/GridArea";
import Grid from "../Grid";
import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";

import Component from "./";

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
  <Grid>
    <GridArea $colSpan={[12, 6, 6]}>
      <Component {...args} />
    </GridArea>
  </Grid>
);

export const VideoPlayer = Template.bind({});
VideoPlayer.args = {};
