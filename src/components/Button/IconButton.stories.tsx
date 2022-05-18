import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./IconButton";

export default {
  title: "Components/Buttons/IconButton",
  component: Component,
  argTypes: {
    argTypes: { onClick: { action: "clicked" } },
    "aria-label": {
      defaultValue: "Click me",
    },
    background: {
      defaultValue: "teachers-primary",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <div>
    <div>
      <h1>Button</h1>

      <Component {...args} />
    </div>
  </div>
);

export const Example = Template.bind({});

Example.args = {
  icon: "Download",
  variant: "primary",
};
