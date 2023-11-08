import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import Component, { ShareCardGroupProps } from "./ShareCardGroup";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Download Components/Share Card Group",
};

export default meta;

type Story = StoryObj<typeof Component>;

const Wrapper = (args: ShareCardGroupProps) => {
  const { control } = useForm({
    mode: "onBlur",
  });
  return <Component {...args} control={control} />;
};

const exitQuiz = {
  type: "exit-quiz-questions" as const,
  exists: true,
  label: "Exit quiz",
  metadata: "6 questions",
};
const starterQuiz = {
  type: "intro-quiz-questions" as const,
  exists: true,
  label: "Starter quiz",
  metadata: "6 questions",
};
const video = {
  type: "video" as const,
  exists: true,
  label: "Video",
  metadata: "57:23",
};
const worksheet = {
  type: "worksheet-pdf" as const,
  exists: true,
  label: "Worksheet",
  metadata: "PDF",
};

export const AllResources: Story = {
  args: {
    shareableResources: [video, worksheet, exitQuiz, starterQuiz],
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

export const noVideo: Story = {
  args: {
    shareableResources: [worksheet, exitQuiz, starterQuiz],
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

export const noVideoNoExitQuiz: Story = {
  args: {
    shareableResources: [worksheet, starterQuiz],
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};
