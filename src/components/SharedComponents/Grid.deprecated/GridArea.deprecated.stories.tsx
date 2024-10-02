import { Meta } from "@storybook/react";

import Component from "./GridArea.deprecated";

import Grid from ".";

import Card from "@/components/SharedComponents/Card";

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
} as Meta<typeof Component>;

export const GridArea = {};
