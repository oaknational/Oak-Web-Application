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

export const AllResources: Story = {
  args: {
    shareableResources: [
      {
        type: "exit-quiz-questions",
        exists: true,
        label: "Exit quiz",
        metadata: "6 questions",
      },
      {
        type: "intro-quiz-questions",
        exists: true,
        label: "Starter quiz",
        metadata: "6 questions",
      },
      { type: "video", exists: true, label: "Video", metadata: "57:23" },
      {
        type: "worksheet-pdf",
        exists: true,
        label: "Worksheet",
        metadata: "PDF",
      },
    ],
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};
