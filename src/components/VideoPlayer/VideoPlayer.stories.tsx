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
      defaultValue: "gnA3ZKbsgZ59IZOF7qFX1GdRSZghRluqEqmE2rWCdps",
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
