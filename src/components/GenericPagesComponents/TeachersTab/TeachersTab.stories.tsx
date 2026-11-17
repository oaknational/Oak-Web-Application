import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./TeachersTab";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";
import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";

export default {
  decorators: [AnalyticsDecorator, TeacherBrowseAnalyticsDecorator],
  component: Component,
  argTypes: {},
  parameters: {
    nextjs: {
      // SubjectPhasePicker always calls useRouter from next/navigation,
      // so the app router mocks must exist.
      appDirectory: true,
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component {...args} curriculumPhaseOptions={curriculumPhaseOptions} />
);

export const TeachersTab = {
  render: Template,
};
