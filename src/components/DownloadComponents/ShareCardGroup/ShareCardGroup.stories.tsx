import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import Component, { ShareCardGroupProps } from "./ShareCardGroup";

import * as resources from "@/node-lib/curriculum-api/fixtures/shareableResources.fixture";

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
  return (
    <Component {...args} control={control} shareLink="https://example.com" />
  );
};

export const AllResources: Story = {
  args: {
    shareableResources: resources.allResources,
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

export const noVideo: Story = {
  args: {
    shareableResources: resources.noVideo,
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

export const noVideoNoExitQuiz: Story = {
  args: {
    shareableResources: resources.noVideoNoExitQuiz,
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};
