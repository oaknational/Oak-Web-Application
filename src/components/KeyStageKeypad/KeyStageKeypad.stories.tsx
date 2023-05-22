import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import keyStageKeypad from "../../browser-lib/fixtures/keyStageKeypad";
import Flex from "../Flex";

import Component from "./KeyStageKeypad";

export default {
  title: "Navigation",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
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
};

export const KeyStageKeypad = Template.bind({});
