import { ComponentStory, ComponentMeta } from "@storybook/react";

import Box from "../../Box";

import Component from ".";

export default {
  title: "Blog/WebinarWall",
  component: Component,
  decorators: [
    (Story) => (
      <Box $position="relative" $height={240} $width={320} $ma="auto">
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    argTypes: { onClick: { action: "clicked" } },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const WebinarWall = Template.bind({});
WebinarWall.args = {
  headingTag: "h3",
};
