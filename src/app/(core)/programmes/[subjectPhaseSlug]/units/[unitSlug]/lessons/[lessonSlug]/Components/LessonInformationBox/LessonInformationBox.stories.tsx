import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import LessonInformationBox from "./LessonInformationBox";

const meta = {
  title: "App/Programmes/Units/Lessons/LessonInformationBox",
  component: LessonInformationBox,
  tags: ["autodocs"],
  parameters: {
    controls: {
      include: ["teacherTip"],
    },
  },
  argTypes: {
    teacherTip: {
      control: {
        type: "radio",
      },
      options: [
        undefined,
        [
          "Allow pupils to sensibly and kindly trigger a reflex response to allow pupils to realise that the response happens before they know about it.",
        ],
        ["teacher tip 1", "teacher tip 2", "teacher tip 3"],
      ],
    },
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof LessonInformationBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    teacherTip: [
      "Allow pupils to sensibly and kindly trigger a reflex response to allow pupils to realise that the response happens before they know about it.",
    ],
  },
} satisfies Story;
