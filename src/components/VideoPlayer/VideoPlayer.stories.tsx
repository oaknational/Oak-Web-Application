import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Grid from "../Grid";
import GridArea from "../Grid/GridArea";

import Component from "./VideoPlayer";

export default {
  title: "Media/ Video Player",
  component: Component,
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
