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

import UnitHeader, { UnitHeaderProps } from "./UnitHeader";

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
      include: [
        "heading",
        "summary",
        "phase",
        "subjectIcon",
        "prevUnit",
        "nextUnit",
      ],
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

const coreProps: UnitHeaderProps = {
  heading: "IT and the world of work",
  phase: "secondary",
  subjectIcon: "subject-computer-science",
  unitDownloadFileId: "1",
  onUnitDownloadSuccess: () => console.log("success"),
  nextUnit: "unit 3",
  prevUnit: "unit 1",
};

export const Default: Story = {
  args: coreProps,
};

export const WithSummaryAndBullets: Story = {
  args: {
    ...coreProps,
    heading: "IT and the world of work",
    summary:
      "Our computing curriculum is taught through real-world contexts, helping pupils understand how technology works, think critically and develop future-ready digital skills.",
    bullets: [
      "National curriculum-aligned, fully sequenced",
      "Practical, engaging lessons",
      "Responsible digital citizenship",
    ],
  },
};

export const WithHeaderSlot: Story = {
  args: {
    ...coreProps,
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
    ...coreProps,
    tags: ["Tag 1", "Long tag name for number 2", "T3"],
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
    ...coreProps,
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
