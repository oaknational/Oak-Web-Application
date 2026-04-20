import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import LessonInformationBox from "./LessonInformationBox";

const meta = {
  title: "App/Programmes/Units/Lessons/LessonInformationBox",
  component: LessonInformationBox,
  tags: ["autodocs"],
  parameters: {
    controls: {
      include: [
        "teacherTip",
        "equipment",
        "contentGuidance",
        "supervision",
        "filesNeeded",
      ],
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
    equipment: {
      control: {
        type: "radio",
      },
      options: [
        undefined,
        ["Equipment item 1", "Equipment item 2", "Equipment item 3"],
      ],
    },
    contentGuidance: {
      control: {
        type: "radio",
      },
      options: [
        undefined,
        [
          "Content guidance item 1",
          "Content guidance item 2",
          "Content guidance item 3",
        ],
      ],
    },
    supervision: {
      control: {
        type: "radio",
      },
      options: [
        undefined,
        ["Supervision item 1", "Supervision item 2", "Supervision item 3"],
      ],
    },
    filesNeeded: {
      control: {
        type: "radio",
      },
      options: [undefined, "file", "files"],
      mapping: {
        undefined: undefined,
        files: {
          files: ["File 1", "File 2", "File 3"],
          href: "#",
          geoRestricted: false,
          loginRequired: false,
        },
        file: {
          files: ["File 1"],
          href: "#",
          geoRestricted: false,
          loginRequired: false,
        },
      },
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
