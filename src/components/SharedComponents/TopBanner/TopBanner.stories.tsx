import type { Meta, StoryObj } from "@storybook/nextjs";

import TopBanner from "./TopBanner";
import { topBannerFixture } from "./TopBanner.fixture";

import { OakUiRoleToken } from "@/styles/oakThemeApp";

const meta = {
  component: TopBanner,
  tags: ["autodocs"],
  title: "Components/SharedComponents/TopBanner",
  argTypes: {
    displayNewTag: { control: "boolean" },
    messagePortableText: { control: "object" },
    displayCta: { control: "boolean" },
    cta: { control: "object" },
    backgroundColor: {
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
} satisfies Meta<typeof TopBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...topBannerFixture,
  },
};
