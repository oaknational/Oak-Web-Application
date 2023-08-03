import { Meta, StoryObj } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import Flex from "../Flex";
import subjectPhaseOptions from "../../browser-lib/fixtures/subjectPhaseOptions";

import Component from "./SubjectPhasePicker";

const meta: Meta<typeof Component> = {
  title: "",
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
