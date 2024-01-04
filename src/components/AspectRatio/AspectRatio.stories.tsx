import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component, { ASPECT_RATIOS } from "./AspectRatio";

import Box from "@/components/SharedComponents/Box";

export default {
  component: Component,
  argTypes: {
    ratio: { control: { type: "select", options: ASPECT_RATIOS } },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Box $background="black" $width={120} $position="relative">
    <Component {...args} />
  </Box>
);

export const AspectRatio = Template.bind({});

AspectRatio.args = {
  ratio: "1:1",
};
