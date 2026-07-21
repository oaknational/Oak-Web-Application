import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./TeachersTab";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
  parameters: {
    nextjs: {
      appDirectory: false,
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component {...args} curriculumPhaseOptions={curriculumPhaseOptions} />
);

export const TeachersTab = {
  render: Template,
};
