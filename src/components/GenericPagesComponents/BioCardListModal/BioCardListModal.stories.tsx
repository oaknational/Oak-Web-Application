import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { OverlayProvider } from "react-aria";

import Component from ".";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return (
    <OverlayProvider>
      <Component {...args} />
    </OverlayProvider>
  );
};

export const BioCarsListModal = Template.bind({});
BioCarsListModal.args = {};
