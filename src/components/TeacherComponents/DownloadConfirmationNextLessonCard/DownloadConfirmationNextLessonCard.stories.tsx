import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./DownloadConfirmationNextLessonCard";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    lessonSlug: { defaultValue: "test-slug" },
    lessonTitle: { defaultValue: "test-lesson" },
    programmeSlug: { defaultValue: "test-programme" },
    unitSlug: { defaultValue: "test-unit" },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const DownloadConfirmationNextLessonCard: Story = {
  args: {
    lessonSlug: "test-slug",
    lessonTitle: "test-lesson",
    programmeSlug: "test-programme",
    unitSlug: "test-unit",
  },

  render: (args) => {
    return <Component {...args} />;
  },
};
