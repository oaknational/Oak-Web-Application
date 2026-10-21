import type { Meta, StoryObj } from "@storybook/nextjs";

import TopBanner, { TopBannerProps } from "./TopBanner";
import { topBannerFixture } from "./TopBanner.fixture";

import { OakUiRoleToken } from "@/styles/oakThemeApp";

const TopBannerPreview = (args: Readonly<TopBannerProps>) => (
  <TopBanner topBanner={args} />
);

const meta = {
  component: TopBannerPreview,
  tags: ["autodocs"],
  title: "Components/SharedComponents/TopBanner",
  argTypes: {
    messagePortableTextWithPromo: { control: "object" },
    enabled: { control: "boolean" },
    cta: { control: "object" },
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
} satisfies Meta<typeof TopBannerPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...topBannerFixture,
  },
};
