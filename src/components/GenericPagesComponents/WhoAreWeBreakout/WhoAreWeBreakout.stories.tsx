import { Meta, StoryObj } from "@storybook/nextjs";

import { WhoAreWeBreakout as Component } from ".";

import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";


const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/WhoAreWeBreakout",
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
    image: {
      asset: {
        _id: "ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001-jpg",
        url: "https://sanity-asset-cdn.thenational.academy/images/cuvjke51/production/ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001.jpg?w=640&fm=webp&q=80&fit=clip&auto=format",
      },
      altText: "",
    },
    content:
      "We’re Oak, your trusted planning partner for great teaching. Our free, adaptable resources evolve with education to give teachers and schools the latest tools to deliver inspiring lessons, save time and improve pupil outcomes.",
  },
  render: (args) => <Component {...args} />,
};
