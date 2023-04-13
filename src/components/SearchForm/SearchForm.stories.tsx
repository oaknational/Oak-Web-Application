import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SearchForm";

export default {
  title: "Form Fields/Search",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SearchInput = Template.bind({});
