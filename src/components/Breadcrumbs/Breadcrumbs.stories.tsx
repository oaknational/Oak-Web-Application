import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Breadcrumbs from "./Breadcrumbs";

export default {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  argTypes: {},
} as ComponentMeta<typeof Breadcrumbs>;

const Template: ComponentStory<typeof Breadcrumbs> = (args) => (
  <div>
    <Breadcrumbs breadcrumbs={args.breadcrumbs} />
  </div>
);

export const BreadcrumbExample = Template.bind({});
BreadcrumbExample.args = {
  breadcrumbs: [
    { href: "/", label: "Unit Quiz" },
    { href: "/", label: "View In Classroom" },
    { href: "/", label: "Foundation Curriculum (PDF)" },
    { href: "/", label: "Higher Curriculum (PDF)" },
  ],
};
