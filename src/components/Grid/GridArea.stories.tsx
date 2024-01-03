import { ComponentStory, ComponentMeta } from "@storybook/react";

import Card from "../Card";

import Component from "./GridArea";

import Grid from ".";

export default {
  component: Component,
  decorators: [
    (Story) => (
      <Grid>
        <Story />
      </Grid>
    ),
  ],
  argTypes: {
    children: {
      defaultValue: <Card $background={"grey30"}>Grid box</Card>,
    },
    colSpan: { defaultValue: [12, 6, 4] },
    rowSpan: { defaultValue: 1 },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const GridArea = Template.bind({});
