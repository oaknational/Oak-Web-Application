import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { WhoAreWeDesc as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/WhoAreWeDesc",
  argTypes: {},
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "We are...",
    items: [
      {
        title: "Built for the reality of teaching",
        text: "We get it. Time is tight, classes vary, and only teachers can know pupils best. That’s why our materials are flexible tools to adapt, not scripts to follow: a starting point that supports your expertise and style.",
      },
      {
        title: "Expert created and quality assured",
        text: "Created by subject and curriculum experts, our resources are informed by the best available evidence of what works, aligned to the national curriculum and tested by real teachers.",
      },
      {
        title: "Free, and always will be",
        text: "We’re funded by the Department for Education. No paywalls, package tiers, or hidden costs.",
      },
      {
        title: "Independent and optional",
        text: "Oak is by teachers, for teachers. Our board is publicly appointed, and our partners selected through an open process.",
      },
    ],
  },
  render: (args) => <Component {...args} />,
};
