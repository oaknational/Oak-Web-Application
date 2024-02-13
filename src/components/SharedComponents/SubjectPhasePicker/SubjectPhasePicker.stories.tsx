import { Meta, StoryObj } from "@storybook/react";
import { OakFlex } from "@oaknational/oak-components";

import Component from "./SubjectPhasePicker";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const KeyStageKeypad: Story = {
  render: () => {
    return (
      <OakFlex $flexDirection={"column"} $pa="inner-padding-m">
        <Component {...subjectPhaseOptions} />
      </OakFlex>
    );
  },
};
