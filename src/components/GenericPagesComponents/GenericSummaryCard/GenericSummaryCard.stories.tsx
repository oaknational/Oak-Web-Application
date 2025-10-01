import { Meta } from "@storybook/nextjs";

import Component from "./GenericSummaryCard";

import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const GenericSummaryCard = {
  args: {
    title: "Title",
    heading: "Heading",
    summaryPortableText: portableTextFromString(
      "We’re here to support great teaching. We’re an independent public body. We work in partnership to improve pupil outcomes and close the disadvantage gap by supporting teachers to teach, and enabling pupils to access a high-quality curriculum.",
    ),
  },
};
