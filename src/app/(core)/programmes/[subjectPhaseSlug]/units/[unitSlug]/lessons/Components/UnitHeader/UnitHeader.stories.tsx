import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import {
  OakBreadcrumbs,
  oakDefaultTheme,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { mocked } from "storybook/test";

import { __setMockAuthState } from "../../../../../../../../../../.storybook/mocks/clerk";

import UnitHeader, { UnitHeaderProps } from "./UnitHeader";

import useUnitDownloadExistenceCheck from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck";

const meta: Meta<typeof UnitHeader> = {
  component: UnitHeader,
  tags: ["autodocs"],
  title: "App/Programmes/Units/UnitHeader",
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
  nextUnit: { title: "unit 3", slug: "unit-3" },
  prevUnit: { title: "unit 1", slug: "unit-1" },
  programmeSlug: "computer-science-ks4-aqa",
  subjectPhaseSlug: "computer-science-secondary-aqa",
  trackingProps: {
    unitName: "IT and the world of work",
    unitSlug: "",
    keyStageSlug: "",
    keyStageTitle: "Key stage 4",
    subjectSlug: "computer-science",
    subjectTitle: "Computer science",
  },
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
