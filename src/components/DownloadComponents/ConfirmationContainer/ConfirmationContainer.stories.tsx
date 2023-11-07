import { Meta, StoryObj } from "@storybook/react";

import Component from "./ConfirmationContainer";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Download Components/Confirmation Container",
  argTypes: {
    programmeSlug: { defaultValue: "programme-slug" },
    unitSlug: { defaultValue: "unit-slug" },
    lessonSlug: { defaultValue: "lesson-slug" },
    lessonTitle: { defaultValue: "lesson-title" },
    futureLessons: {
      defaultValue: ["future-lesson-1", "future-lesson-2", "future-lesson-3"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const ConfirmationContainer: Story = {
  args: {
    programmeSlug: "programme-slug",
    unitSlug: "unit-slug",
    lessonSlug: "lesson-slug",
    lessonTitle: "lesson-title",
    futureLessons: ["future-lesson-1", "future-lesson-2", "future-lesson-3"],
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
