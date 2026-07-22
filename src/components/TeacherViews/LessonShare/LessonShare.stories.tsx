import type { Meta, StoryObj } from "@storybook/nextjs";

import { LessonShare } from "./LessonShare.view";

import lessonShareFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonShare.fixture";
import NotificationsDecorator from "@/storybook-decorators/NotificationsDecorator";

const meta: Meta<typeof LessonShare> = {
  component: LessonShare,
  decorators: [NotificationsDecorator],
};

export default meta;
type Story = StoryObj<typeof LessonShare>;

export const SharePage: Story = {
  args: {
    lesson: lessonShareFixtures(),
  },
};
