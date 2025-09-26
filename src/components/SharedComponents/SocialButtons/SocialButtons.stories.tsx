import { Meta } from "@storybook/nextjs";

import Component, { OAK_SOCIALS } from "./SocialButtons";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const SocialButtons = {
  args: {
    ...OAK_SOCIALS,
  },
};
