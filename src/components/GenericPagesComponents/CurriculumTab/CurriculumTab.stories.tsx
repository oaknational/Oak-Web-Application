import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./CurriculumTab";

import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";
import CookieConsentDecorator from "@/storybook-decorators/CookieConsentDecorator";

const meta = {
  decorators: [
    AnalyticsDecorator,
    TeacherBrowseAnalyticsDecorator,
    CookieConsentDecorator,
  ],
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
