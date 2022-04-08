import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Breadcrumbs from "./Breadcrumbs";

export default {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  argTypes: {},
} as ComponentMeta<typeof Breadcrumbs>;

const Template: ComponentStory<typeof Breadcrumbs> = (args) => (
  <div>
    <div>
      <h1>Breadcrumbs</h1>
      <p>
        Pass me an array of {"{ href, text }"} and the Link component, and
        I&apos;ll put chevrons between them.
      </p>
      <h2>Examples</h2>
      <Breadcrumbs breadcrumbs={args.breadcrumbs} />
    </div>
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
