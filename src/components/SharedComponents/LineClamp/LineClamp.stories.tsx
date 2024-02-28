import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    lines: {
      defaultValue: 3,
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Id semper risus in
    hendrerit gravida rutrum quisque non tellus. Nibh praesent tristique magna
    sit. A arcu cursus vitae congue mauris rhoncus aenean. Turpis egestas
    maecenas pharetra convallis posuere morbi leo. Faucibus pulvinar elementum
    integer enim neque volutpat ac tincidunt. Vitae suscipit tellus mauris a
    diam maecenas.
  </Component>
);

export const LineClamp = Template.bind({});
