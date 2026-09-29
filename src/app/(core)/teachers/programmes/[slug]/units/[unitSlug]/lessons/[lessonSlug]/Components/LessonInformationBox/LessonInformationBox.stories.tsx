import type { Meta, StoryObj } from "@storybook/nextjs";

import LessonInformationBox from "./LessonInformationBox";

const meta = {
  title: "App/Programmes/Units/Lessons/LessonInformationBox",
  component: LessonInformationBox,
  tags: ["autodocs"],
  parameters: {
    controls: {
      include: [
        "equipment",
        "contentGuidance",
        "supervision",
        "filesNeeded",
        "licence",
      ],
    },
  },
  argTypes: {
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
    licence: {
      control: {
        type: "radio",
      },
      options: [undefined, "showLicence"],
      mapping: {
        undefined: undefined,
        showLicence: {
          openLinksExternally: true,
          copyrightYear: "2022",
        },
      },
    },
  },
} satisfies Meta<typeof LessonInformationBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    equipment: ["Equipment item 1", "Equipment item 2", "Equipment item 3"],
  },
} satisfies Story;
