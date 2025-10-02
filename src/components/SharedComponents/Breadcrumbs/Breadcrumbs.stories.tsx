import { Meta } from "@storybook/nextjs";

import Component from "./Breadcrumbs";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const Breadcrumbs = {
  args: {
    breadcrumbs: [
      { oakLinkProps: { href: "/", page: null }, label: "Unit Quiz" },
      { oakLinkProps: { href: "/", page: null }, label: "View In Classroom" },
      {
        oakLinkProps: { href: "/", page: null },
        label: "Foundation Curriculum (PDF)",
      },
      {
        oakLinkProps: { href: "/", page: null },
        label: "Higher Curriculum (PDF)",
      },
    ],
  },
};
