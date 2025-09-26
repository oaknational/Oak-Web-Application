import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./DownloadConfirmationNextLessonContainer";

const meta: Meta<typeof Component> = {
  component: Component,

  argTypes: {
    programmeSlug: { defaultValue: "programme-slug" },
    unitSlug: { defaultValue: "unit-slug" },
    nextLessons: {
      defaultValue: [
        {
          lessonSlug: "test-lesson",
          lessonTitle: "test-lesson-title",
        },
        {
          lessonSlug: "test-lesson-2",
          lessonTitle: "test-lesson-title-2",
        },
        {
          lessonSlug: "test-lesson-3",
          lessonTitle: "test-lesson-title-3",
        },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const DownloadConfirmationNextLessonContainer: Story = {
  args: {
    programmeSlug: "programme-slug",
    unitSlug: "unit-slug",
    nextLessons: [
      {
        lessonSlug: "test-lesson",
        lessonTitle: "test-lesson-title",
      },
      {
        lessonSlug: "test-lesson-2",
        lessonTitle: "test-lesson-title-2",
      },
      {
        lessonSlug: "test-lesson-3",
        lessonTitle: "test-lesson-title-3",
      },
    ],
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
