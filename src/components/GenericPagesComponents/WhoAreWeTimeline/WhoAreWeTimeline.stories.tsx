import { Meta, StoryObj } from "@storybook/nextjs";

import Component from ".";

import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";


const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/WhoAreWeTimeline",
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
    title: "As teaching evolves, so do we...",
    subTitle: "Oak’s story",
    items: [
      {
        subTitle: "From then",
        title: "A rapid response to the pandemic",
        text: [
          "In 2020, teachers needed a quick way to keep pupils learning during lockdown. So we brought together a group of expert partners to support schools with thousands of lessons designed for remote learning.",
        ],
      },
      {
        subTitle: "To now",
        title: "Complete resources for the classroom, schools and trusts",
        text: [
          "From early years to exam years, we now provide complete curriculum support for the classroom. Every national curriculum subject, every unit, every lesson, in one place.",
          "We’re also transforming lesson prep with AI tools that help teachers create, adapt, and enhance their lessons in minutes, while keeping quality high and content safe.",
        ],
      },
      {
        subTitle: "And beyond",
        title: "Staying ahead in a changing world",
        text: [
          "We’ve always anticipated the emerging needs of teachers – from building safe and secure AI tools, to making our platform code available to partners who want to integrate it directly. We’ll keep innovating as we find new ways to help teachers stay ahead in a changing world.",
        ],
      },
    ],
  },
  render: (args) => <Component {...args} />,
};
