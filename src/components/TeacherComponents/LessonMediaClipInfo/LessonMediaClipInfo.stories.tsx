import { Meta, StoryObj } from "@storybook/react";

import { LessonMediaClipInfoProps } from "./LessonMediaClipInfo";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {
    clipTitle: { control: "text" }
  },
  parameters: {
    controls: {
      include: ["clipTitle"],
    },
  },
};

const props: LessonMediaClipInfoProps = {
  clipTitle: "How can we train muscular endurance?",
  keyStageSlug: "KS3",
  yearSlug: "Year 7",
  subjectSlug: "Physical education",
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Standard: Story = {
  render: ({ ...args }) => <Component {...args} />,
  args: { ...props },
}