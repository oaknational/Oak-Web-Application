import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { SearchSuggestionBanner as Component } from "./SearchSuggestionBanner";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    metadata: "Key stage 1",
    title: "History",
    body: "At KS3, history tells a connected story of Britain in the wider world, building powerful knowledge, vocabulary, and enquiry skills.",
    links: [
      {
        keystageSlug: "ks1",
        keystageTitle: "Key stage 1",
      },
    ],
  },
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Component {...args} />
    </OakThemeProvider>
  ),
};
