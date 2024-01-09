import type { Meta, StoryObj } from "@storybook/react";

import { LessonShare } from "./LessonShare.page";

import lessonShareFixtures from "@/node-lib/curriculum-api/fixtures/lessonShare.fixture";

const meta: Meta<typeof LessonShare> = {
  component: LessonShare,
};

export default meta;
type Story = StoryObj<typeof LessonShare>;

export const SharePage: Story = {
  args: {
    isCanonical: false,
    lesson: lessonShareFixtures(),
  },
};
