import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

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
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return (
    <Component
      {...args}
      onEditClick={() => {
        console.log("edit details clicked");
      }}
    />
  );
};

export const ResourcePageDetailsCompleted = {
  render: Template,
};
