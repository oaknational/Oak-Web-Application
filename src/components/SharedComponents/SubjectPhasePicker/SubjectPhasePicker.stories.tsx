import { Meta, StoryObj } from "@storybook/nextjs";
import { OakFlex } from "@oaknational/oak-components";

import Component from "./SubjectPhasePicker";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";
import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator, TeacherBrowseAnalyticsDecorator],
  component: Component,
  argTypes: {},
  parameters: {
    nextjs: {
      // The component always calls useRouter from next/navigation, so the
      // app router mocks must exist even though it also supports the pages router.
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const KeyStageKeypad: Story = {
  render: () => {
    return (
      <OakFlex $flexDirection={"column"} $pa="spacing-16">
        <Component {...curriculumPhaseOptions} />
      </OakFlex>
    );
  },
};
