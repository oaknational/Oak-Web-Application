import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import { DownloadFormProps } from "../downloads.types";

import Component, { DownloadCardGroupProps } from "./DownloadCardGroup";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Download Components/Card Group",
};

export default meta;

type Story = StoryObj<typeof Component>;

const Wrapper = (args: DownloadCardGroupProps) => {
  const { control } = useForm<DownloadFormProps>({
    mode: "onBlur",
  });
  return <Component {...args} control={control} />;
};

export const CardGroup: Story = {
  args: {
    downloads: [
      {
        exists: true,
        type: "presentation",
        label: "Slide deck",
        ext: "pptx",
        forbidden: null,
      },
      {
        exists: true,
        type: "intro-quiz-questions",
        label: "Starter quiz questions",
        ext: "pdf",
      },
      {
        exists: true,
        type: "intro-quiz-answers",
        label: "Starter quiz answers",
        ext: "pdf",
      },
      {
        exists: true,
        type: "exit-quiz-questions",
        label: "Exit quiz questions",
        ext: "pdf",
      },
      {
        exists: true,
        type: "exit-quiz-answers",
        label: "Exit quiz answers",
        ext: "pdf",
      },
      {
        exists: true,
        type: "worksheet-pdf",
        label: "Worksheet",
        ext: "pdf",
      },
      {
        exists: true,
        type: "worksheet-pptx",
        label: "Worksheet",
        ext: "pptx",
      },
      {
        exists: false,
        type: "supplementary-pdf",
        label: "Additional material",
        ext: "pdf",
      },
      {
        exists: false,
        type: "supplementary-docx",
        label: "Additional material",
        ext: "docx",
      },
    ],
    triggerForm: () => {},
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};
