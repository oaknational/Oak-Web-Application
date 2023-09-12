// import React, { useState } from "react";
// import type { Meta, StoryObj } from "@storybook/react";

// import Component from "./HomePageTabImageNav";

// const meta: Meta<typeof Component> = {
//   title: "Navigation/HomePageTabImageNav",
//   component: Component,
//   argTypes: {},
// };

// export default meta;
// type Story = StoryObj<typeof Component>;

// export const HomePageTabImageNav: Story = {
//   args: {},
//   render: (args) => {
//     const [current, setCurrent] = useState("teachers");
//     return <Component {...args} current={current} setCurrent={setCurrent} />;
//   },
// };

import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Navigation/HomePageTabImageNav",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [current, setCurrent] = useState("teachers");
  return (
    <Component {...args} current={current} setCurrent={setCurrent}/>
  );
};

export const HomePageTabImageNav = Template.bind({});
