import type { Meta, StoryObj } from "@storybook/nextjs";

import TopBanner from "./TopBanner";

import { OakUiRoleToken } from "@/styles/oakThemeApp";

const Component = ({
  message,
  ctaText,
  ctaLink,
  backgroundColour,
}: {
  message: string;
  ctaText: string;
  ctaLink: string;
  backgroundColour: string;
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
      backgroundColour,
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
    backgroundColour: {
      control: "select",
      options: [
        "bg-decorative1-main",
        "bg-decorative2-main",
        "bg-decorative3-main",
        "bg-decorative4-main",
        "bg-decorative5-main",
      ] as OakUiRoleToken[],
      defaultValue: "bg-decorative1-main",
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    message: "Oak is now used in 72% of schools",
    ctaText: "Explore our impact",
    ctaLink: "https://www.thenational.academy/about-us/oaks-impact",
    backgroundColour: "bg-decorative1-main",
  },
};
