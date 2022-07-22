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
      defaultValue: "G5yFY00uCcEoOISnQtpG7OmE1BoG2Fct01M2cozKJeiYs",
    },
    title: {
      defaultValue: "Right to Education",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Grid>
    <GridArea colSpan={[12, 6, 6]}>
      <Component {...args} />
    </GridArea>
  </Grid>
);

export const VideoPlayer = Template.bind({});
VideoPlayer.args = {};
