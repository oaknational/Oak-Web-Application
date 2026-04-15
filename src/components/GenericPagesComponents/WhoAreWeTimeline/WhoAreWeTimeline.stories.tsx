import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import Component from ".";

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
        subHeading: "From then",
        heading: "A rapid response to the pandemic",
        textRaw: [
          {
            _key: "test1",
            _type: "block",
            children: [
              {
                _key: "span1",
                _type: "span",
                marks: [],
                text: "In 2020, teachers needed a quick way to keep pupils learning during lockdown. So we brought together a group of expert partners to support schools with thousands of lessons designed for remote learning.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
      },
      {
        subHeading: "To now",
        heading: "Complete resources for the classroom, schools and trusts",
        textRaw: [
          {
            _key: "test2",
            _type: "block",
            children: [
              {
                _key: "span2",
                _type: "span",
                marks: [],
                text: "From early years to exam years, we now provide complete curriculum support for the classroom. Every national curriculum subject, every unit, every lesson, in one place. We're also transforming lesson prep with AI tools that help teachers create, adapt, and enhance their lessons in minutes, while keeping quality high and content safe.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
      },
      {
        subHeading: "And beyond",
        heading: "Staying ahead in a changing world",
        textRaw: [
          {
            _key: "test3",
            _type: "block",
            children: [
              {
                _key: "span3",
                _type: "span",
                marks: [],
                text: "We've always anticipated the emerging needs of teachers – from building safe and secure AI tools, to making our platform code available to partners who want to integrate it directly. We'll keep innovating as we find new ways to help teachers stay ahead in a changing world.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
      },
    ],
  },
  render: (args) => <Component {...args} />,
};
