import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Download Components/No resources to download",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  return <Component />;
};

export const DetailsCompleted = Template.bind({});
