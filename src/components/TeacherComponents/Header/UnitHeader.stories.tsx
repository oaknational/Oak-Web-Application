import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import {
  OakBreadcrumbs,
  oakDefaultTheme,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { mocked } from "storybook/test";

import { __setMockAuthState } from "../../../../.storybook/mocks/clerk";
import useUnitDownloadExistenceCheck from "../hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck";

import UnitHeader from "./UnitHeader";

const meta: Meta<typeof UnitHeader> = {
  component: UnitHeader,
  tags: ["autodocs"],
  beforeEach: () => {
    mocked(useUnitDownloadExistenceCheck).mockReturnValue({
      exists: true,
      fileSize: "100MB",
      hasCheckedFiles: true,
    });
  },
  argTypes: {
    backgroundColorLevel: {
      control: {
        type: "select",
      },
      options: [undefined, 1, 2, 3, 4, 5, 6],
    },
    subjectIcon: {
      options: [
        undefined,
        "subject-maths",
        "subject-english",
        "subject-computer-science",
      ],
    },
  },
  parameters: {
    controls: {
      include: ["backgroundColorLevel", "subjectIcon"],
    },
  },
  decorators: [
    (Story) => {
      __setMockAuthState({ isSignedIn: true });
      return (
        <OakThemeProvider theme={oakDefaultTheme}>
          <Story />
        </OakThemeProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof UnitHeader>;

export const Default: Story = {
  args: {
    heading: "IT and the world of work",
    backgroundColorLevel: 3,
    subjectIcon: "subject-computer-science",
    unitDownloadFileId: "1",
    onUnitDownloadSuccess: () => console.log("success"),
  },
};

export const WithSummaryAndBullets: Story = {
  args: {
    heading: "IT and the world of work",
    summary:
      "Our computing curriculum is taught through real-world contexts, helping pupils understand how technology works, think critically and develop future-ready digital skills.",
    bullets: [
      "National curriculum-aligned, fully sequenced",
      "Practical, engaging lessons",
      "Responsible digital citizenship",
    ],
    backgroundColorLevel: 3,
    subjectIcon: "subject-computer-science",
    unitDownloadFileId: "1",
    onUnitDownloadSuccess: () => console.log("success"),
  },
};

export const WithHeaderSlot: Story = {
  args: {
    heading: "IT and the world of work",
    backgroundColorLevel: 3,
    subjectIcon: "subject-computer-science",
    unitDownloadFileId: "1",
    onUnitDownloadSuccess: () => console.log("success"),
    headerSlot: (
      <OakBreadcrumbs
        breadcrumbs={[
          {
            text: "Level 1",
            href: "www.google.com",
          },
          {
            text: "Level 2",
            href: "www.google.com",
          },
          {
            text: "Level 3",
            href: "www.google.com",
          },
          {
            text: "Level 4",
          },
        ]}
      />
    ),
  },
};

export const WithTags: Story = {
  args: {
    heading: "IT and the world of work",
    backgroundColorLevel: 3,
    subjectIcon: "subject-computer-science",
    tags: ["Tag 1", "Long tag name for number 2", "T3"],
    unitDownloadFileId: "1",
    onUnitDownloadSuccess: () => console.log("success"),
    headerSlot: (
      <OakBreadcrumbs
        breadcrumbs={[
          {
            text: "Level 1",
            href: "www.google.com",
          },
          {
            text: "Level 2",
            href: "www.google.com",
          },
          {
            text: "Level 3",
            href: "www.google.com",
          },
          {
            text: "Level 4",
          },
        ]}
      />
    ),
  },
};

export const SignedOut: Story = {
  decorators: [
    (Story) => {
      __setMockAuthState({ isSignedIn: false });
      return (
        <OakThemeProvider theme={oakDefaultTheme}>
          <Story />
        </OakThemeProvider>
      );
    },
  ],
  args: {
    heading: "IT and the world of work",
    backgroundColorLevel: 3,
    subjectIcon: "subject-computer-science",
    unitDownloadFileId: "1",
    onUnitDownloadSuccess: () => console.log("success"),
    headerSlot: (
      <OakBreadcrumbs
        breadcrumbs={[
          {
            text: "Level 1",
            href: "www.google.com",
          },
          {
            text: "Level 2",
            href: "www.google.com",
          },
          {
            text: "Level 3",
            href: "www.google.com",
          },
          {
            text: "Level 4",
          },
        ]}
      />
    ),
  },
};
