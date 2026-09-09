import type { Meta, StoryObj } from "@storybook/nextjs";

import TeacherTipBox from "./TeacherTipBox";

const meta = {
  title: "App/Programmes/Units/Lessons/TeacherTipBox",
  component: TeacherTipBox,
  tags: ["autodocs"],
  parameters: {
    controls: {
      include: ["tips", "showTeachWithOakCard"],
    },
  },
  argTypes: {
    tips: {
      control: {
        type: "radio",
      },
      options: [
        [
          "Allow pupils to sensibly and kindly trigger a reflex response to allow pupils to realise that the response happens before they know about it.",
        ],
        ["teacher tip 1", "teacher tip 2", "teacher tip 3"],
      ],
    },
  },
} satisfies Meta<typeof TeacherTipBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    tips: [
      "Allow pupils to sensibly and kindly trigger a reflex response to allow pupils to realise that the response happens before they know about it.",
    ],
  },
} satisfies Story;
