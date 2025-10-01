import { StoryFn, Meta } from "@storybook/nextjs";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import Component from ".";

export default {
  component: Component,
  argTypes: {},
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <OakGrid>
    <OakGridArea $colSpan={[12, 6]}>
      <Component {...args} />
    </OakGridArea>
  </OakGrid>
);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const NewsletterForm = {
  render: Template,

  args: {
    onSubmit: async () => {
      await sleep(2000);
    },
  },
};

export const WithError = {
  render: Template,

  parameters: {
    docs: {
      description: {
        story:
          "Fill out this form correctly and press submit to see the submission error.",
      },
    },
  },

  args: {
    onSubmit: async (data: { email: string }) => {
      await sleep(2000);
      if (data.email.includes("fishy")) {
        throw new Error(
          "Thank you, that's been received, but please check as your email doesn't look quite right.",
        );
      }
      throw new Error(
        "Sorry, we couldn't sign you up just now, try again later.",
      );
    },
  },
};
