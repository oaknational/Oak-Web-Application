import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Button from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    argTypes: { onClick: { action: "clicked" } },
    href: {
      defaultValue: "/",
    },
    label: {
      defaultValue: "Button",
    },
    background: {
      defaultValue: "teachers-primary",
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <div>
    <div>
      <h1>Buttons</h1>

      <Button {...args} />
    </div>
  </div>
);

export const ButtonExample = Template.bind({});

ButtonExample.args = {
  label: "Button rounded",
  children: "Button rounded",
  icon: undefined,
  variant: "rounded",
  background: "teachers-primary",
  href: "/",
};

export const ButtonExampleWithIcon = Template.bind({});
ButtonExampleWithIcon.args = {
  background: "pupils-secondary",
  icon: "Download",
};
