import { Meta, StoryObj } from "@storybook/nextjs";
import { OakFlex } from "@oaknational/oak-components";

import Component from "./KeyStageKeypad";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";

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
        <OakFlex
          $background={"mint50"}
          $pa="inner-padding-m"
          $mb="space-between-xs"
        >
          <Component {...keyStageKeypad} />
        </OakFlex>
        <OakFlex
          $background={"mint50"}
          $pa="inner-padding-m"
          $mb="space-between-xs"
        >
          <Component
            keyStages={keyStageKeypad.keyStages}
            title="Select key stage"
            trackingOnClick={() => {}}
          />
        </OakFlex>
      </OakFlex>
    );
  },
};
