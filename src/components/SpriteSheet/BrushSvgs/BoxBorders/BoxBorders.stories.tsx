import { ComponentStory, ComponentMeta } from "@storybook/react";

import Card from "../../../Card";
import CardTitle from "../../../Card/CardComponents/CardTitle";

import Component from ".";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => (
  <Card>
    <CardTitle tag="h2">Did you know about our lessons?</CardTitle>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    <Component />
  </Card>
);

export const BoxBorders = Template.bind({});
