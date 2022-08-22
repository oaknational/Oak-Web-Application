import { ComponentStory, ComponentMeta } from "@storybook/react";

import Grid, { GridArea } from "../../Grid";

import Component from ".";

export default {
  title: "Forms/Newsletter Form",
  component: Component,
  argTypes: {},
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Grid>
    <GridArea $colSpan={[12, 6]}>
      <Component {...args} />
    </GridArea>
  </Grid>
);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const NewsletterForm = Template.bind({});
NewsletterForm.args = {
  onSubmit: async () => {
    await sleep(2000);
  },
};

export const WithError = Template.bind({});
WithError.parameters = {
  docs: {
    description: {
      story:
        "Fill out this form correctly and press submit to see the submission error.",
    },
  },
};
WithError.args = {
  onSubmit: async (data) => {
    await sleep(2000);
    if (data.email.includes("fishy")) {
      throw new Error(
        "Thank you, that's been received, but please check as your email doesn't look quite right."
      );
    }
    throw new Error(
      "Sorry, we couldn't sign you up just now, try again later."
    );
  },
};
