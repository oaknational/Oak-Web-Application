import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    email: {
      defaultValue: "test@test.com",
    },
    school: {
      defaultValue: "Primary School",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return (
    <Component
      {...args}
      onEditClick={() => {
        console.log("edit details clicked");
      }}
    />
  );
};

export const DetailsCompleted = Template.bind({});
