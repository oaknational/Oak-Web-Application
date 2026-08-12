import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./CurriculumTab";

import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

const meta = {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
  parameters: {
    nextjs: {
      appDirectory: false,
    },
  },
} satisfies Meta<typeof Component>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CurriculumTab: Story = {
  args: {
    curriculumPhaseOptions,
  },
};
