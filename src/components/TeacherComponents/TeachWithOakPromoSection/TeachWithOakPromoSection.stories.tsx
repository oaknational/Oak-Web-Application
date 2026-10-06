import { Meta, StoryObj } from "@storybook/nextjs";

import { TeachWithOakPromoSection } from "./TeachWithOakPromoSection";

import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";

const meta: Meta<typeof TeachWithOakPromoSection> = {
  component: TeachWithOakPromoSection,
  decorators: [TeacherBrowseAnalyticsDecorator],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
