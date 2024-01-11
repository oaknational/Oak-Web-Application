import { Meta, StoryObj } from "@storybook/react";

import Component from "./SubjectPhasePicker";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import Flex from "@/components/SharedComponents/Flex";

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
      <Flex $flexDirection={"column"} $pa={16}>
        <Component {...subjectPhaseOptions} />
      </Flex>
    );
  },
};
