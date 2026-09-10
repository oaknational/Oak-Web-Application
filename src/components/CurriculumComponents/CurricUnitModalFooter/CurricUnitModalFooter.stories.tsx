import { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentProps } from "react";

import {
  mockUnit,
  mockUnitWithLessons,
} from "./CurricUnitModalFooter.fixtures";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const LessonsComingSoon: Story = {
  args: {
    programmeSlug: "english-primary",
    unitData: mockUnit,
  },
  render: function Render(args: ComponentProps<typeof Component>) {
    return <Component {...args} />;
  },
};

export const HasLessons: Story = {
  args: {
    programmeSlug: "english-primary",
    unitData: mockUnitWithLessons,
  },
  render: function Render(args: ComponentProps<typeof Component>) {
    return <Component {...args} />;
  },
};
