import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Breadcrumbs";

export default {
  title: "Navigation/Breadcrumbs",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Breadcrumbs = Template.bind({});
Breadcrumbs.args = {
  breadcrumbs: [
    { href: "/", label: "Unit Quiz" },
    { href: "/", label: "View In Classroom" },
    { href: "/", label: "Foundation Curriculum (PDF)" },
    { href: "/", label: "Higher Curriculum (PDF)" },
  ],
};
