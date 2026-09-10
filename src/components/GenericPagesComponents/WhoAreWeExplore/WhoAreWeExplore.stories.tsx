import { Meta, StoryObj } from "@storybook/nextjs";

import { WhoAreWeExplore as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/WhoAreWeExplore",
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

const items = [
  {
    iconName: "logo",
    title: "About Oak",
    href: "#",
    componentType: "about_oak",
  },
  {
    iconName: "homepage-teacher-map",
    title: "Oak's curricula",
    href: "#",
    componentType: "about_curriculum",
  },
  {
    iconName: "snack-break",
    title: "Meet the team",
    href: "#",
    componentType: "meet_the_team",
  },
  {
    iconName: "chatting",
    title: "Get involved",
    href: "#",
    componentType: "get_involved",
  },
] as const;

export const FourItems: Story = {
  args: {
    title: "Explore more about Oak",
    items: items.slice(0, 4),
  },
  render: (args) => <Component {...args} />,
};

export const ThreeItems: Story = {
  args: {
    title: "Explore more about Oak",
    items: items.slice(0, 3),
  },
  render: (args) => <Component {...args} />,
};
