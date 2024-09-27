import { StoryFn, Meta } from "@storybook/react";

import Component from "./KeyStagesNav";

import keyStagesNavData from "@/browser-lib/fixtures/keyStagesNav";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = () => {
  return <Component keyStages={keyStagesNavData} />;
};

export const KeyStagesNav = Template.bind({});
