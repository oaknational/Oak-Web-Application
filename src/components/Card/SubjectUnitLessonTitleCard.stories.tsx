import type { Meta, StoryObj } from "@storybook/react";

import Component from "./SubjectUnitLessonTitleCard";

const meta: Meta<typeof Component> = {
  title: "Cards/Title card",
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const TitleCardLesson: Story = {
  args: {
    title: "Binary conversion",
    page: "lesson",
    keyStage: "Key stage 4",
    keyStageSlug: "key-stage-4",
    subject: "Computing",
    subjectSlug: "computing",
  },
};

export const TitleCardUnit: Story = {
  args: {
    title: "Data representation",
    page: "unit",
    keyStage: "Key stage 4",
    keyStageSlug: "key-stage-4",
  },
};

export const TitleCardSubject: Story = {
  args: {
    title: "Computer Science",
    page: "subject",
    keyStage: "Key stage 4",
    keyStageSlug: "key-stage-4",
    slug: "computer-science",
  },
};
