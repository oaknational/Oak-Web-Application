import { StoryFn, Meta } from "@storybook/nextjs";

import Component from ".";

import Card from "@/components/SharedComponents/Card";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = () => (
  <Card $background={"lemon"}>
    <CardTitle tag="h2">Did you know about our lessons?</CardTitle>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    <Component color={"lemon"} />
  </Card>
);

export const BrushBorders = {
  render: Template,
};
