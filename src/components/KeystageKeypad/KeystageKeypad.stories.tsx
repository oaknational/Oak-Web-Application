import { ComponentStory, ComponentMeta } from "@storybook/react";

import keystageKeypad from "../../browser-lib/fixtures/keystageKeypad";
import Flex from "../Flex";

import Component from "./KeystageKeypad";

export default {
  title: "Navigation",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  return (
    <Flex $flexDirection={"column"} $pa={16}>
      <Flex $background={"pupilsLightGreen"} $pa={16} $mb={12}>
        <Component {...keystageKeypad} />
      </Flex>
      <Flex $background={"pupilsLightGreen"} $pa={16} $mb={12}>
        <Component keystages={keystageKeypad.keystages} />
      </Flex>
    </Flex>
  );
};

export const KeystageKeypad = Template.bind({});
