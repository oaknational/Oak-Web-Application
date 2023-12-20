import { ComponentStory, ComponentMeta } from "@storybook/react";

import keyStagesNavData from "../../browser-lib/fixtures/keyStagesNav";

import Component from "./KeyStagesNav";

export default {
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  return <Component keyStages={keyStagesNavData} />;
};

export const KeyStagesNav = Template.bind({});
