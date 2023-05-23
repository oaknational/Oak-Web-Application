import { Meta, StoryObj } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import keyStageKeypad from "../../browser-lib/fixtures/keyStageKeypad";
import Flex from "../Flex";

import Component from "./KeyStageKeypad";

const meta: Meta<typeof Component> = {
  title: "Navigation",
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
        <Flex $background={"pupilsLightGreen"} $pa={16} $mb={12}>
          <Component {...keyStageKeypad} />
        </Flex>
        <Flex $background={"pupilsLightGreen"} $pa={16} $mb={12}>
          <Component keyStages={keyStageKeypad.keyStages} />
        </Flex>
      </Flex>
    );
  },
};
