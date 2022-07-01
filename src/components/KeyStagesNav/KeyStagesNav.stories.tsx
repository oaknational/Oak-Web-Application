import { ComponentStory, ComponentMeta } from "@storybook/react";

import keyStagesNavData from "../../browser-lib/fixtures/keyStagesNav";

import Component from "./KeyStagesNav";

export default {
  title: "Navigation/Key Stage Nav",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  return <Component keyStages={keyStagesNavData} />;
};

export const BigInput = Template.bind({});
