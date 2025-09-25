import { Meta } from "@storybook/nextjs";

import Component from "./SummaryCard";

export default {
  component: Component,
  argTypes: {},
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
  },
};
