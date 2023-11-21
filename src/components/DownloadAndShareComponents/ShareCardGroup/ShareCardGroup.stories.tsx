import { Meta, StoryObj } from "@storybook/react";
import { Control, useForm } from "react-hook-form";

import { ResourceFormProps } from "../downloadAndShare.types";

import Component, { ShareCardGroupProps } from "./ShareCardGroup";

import * as resources from "@/node-lib/curriculum-api/fixtures/shareableResources.fixture";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Download Components/Share Card Group",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "656px" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    return <Wrapper {...args} />;
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

const Wrapper = (args: ShareCardGroupProps) => {
  const { control } = useForm({
    mode: "onBlur",
  });
  return (
    <Component
      {...args}
      control={control as unknown as Control<ResourceFormProps>}
      shareLink="https://example.com"
    />
  );
};

export const AllResources: Story = {
  args: {
    shareableResources: resources.allResources,
  },
};

export const noVideo: Story = {
  args: {
    shareableResources: resources.noVideo,
  },
};

export const noVideoNoExitQuiz: Story = {
  args: {
    shareableResources: resources.noVideoNoExitQuiz,
  },
};
