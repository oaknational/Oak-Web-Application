import { Meta } from "@storybook/nextjs";

import { TagFunctional as Component } from "./TagFunctional";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const TagFunctional = {
  args: {
    text: "AQA",
  },
};
