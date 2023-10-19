import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

import { HomePageTab } from "@/pages";

export default {
  title: "Navigation/HomePageTabImageNav",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [current, setCurrent] = useState<HomePageTab>("teachers");
  return <Component {...args} current={current} setCurrent={setCurrent} />;
};

export const HomePageTabImageNav = Template.bind({});
