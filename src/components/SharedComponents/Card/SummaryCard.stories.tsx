import { Meta } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import Component from "./SummaryCard";

export default {
  component: Component,
  argTypes: {},
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
} as Meta<typeof Component>;

export const SummaryCard = {
  args: {
    title: "Title",
    summaryPortableText: "A summary section.......",
    background: "lemon50",
  },
};

export const SummaryCardImage = {
  args: {
    title: "Title",
    summaryPortableText: "A summary section.......",
    background: "lemon50",
  },
};

export const SummaryCardCustomImageContainer = {
  args: {
    title: "Title",
    summaryPortableText: "A summary section.......",
    background: "teal",
    imageContainerProps: {
      $minHeight: 160,
    },
    summaryCardImage: {
      alt: "Image of a summary card",
      asset: {
        _ref: "image-abc123-800x600-jpg",
        _type: "reference",
      },
    },
  },
};
