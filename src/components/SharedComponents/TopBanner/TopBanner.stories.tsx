import type { Meta, StoryObj } from "@storybook/nextjs";

import TopBanner from "./TopBanner";

const Component = ({
  message,
  ctaText,
  ctaLink,
}: {
  message: string;
  ctaText: string;
  ctaLink: string;
}) => (
  <TopBanner
    topBanner={{
      messagePortableText: [
        {
          _key: "message",
          _type: "block",
          style: "normal",
          markDefs: [],
          children: [
            {
              _key: "text",
              _type: "span",
              marks: [],
              text: message,
            },
          ],
        },
      ],
      ctaText,
      ctaLink,
    }}
  />
);

const meta = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/SharedComponents/TopBanner",
  argTypes: {
    message: { control: "text" },
    ctaText: { control: "text" },
    ctaLink: { control: "text" },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    message: "Oak is now used in 72% of schools",
    ctaText: "Explore our impact",
    ctaLink: "https://www.thenational.academy/about-us/oaks-impact",
  },
};
