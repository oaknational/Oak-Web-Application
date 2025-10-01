import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";
import { OverlayProvider } from "react-aria";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return (
    <OverlayProvider>
      <Component {...args} />
    </OverlayProvider>
  );
};

export const BioCardListModal = {
  render: Template,
  args: {},
};
