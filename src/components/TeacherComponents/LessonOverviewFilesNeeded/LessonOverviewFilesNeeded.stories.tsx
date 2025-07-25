import { Meta, StoryObj } from "@storybook/react";
import { JSX } from "react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import Component from "./LessonOverviewFilesNeeded";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    additionalFiles: {
      defaultValue: ["file1.pdf", "file2.pdf"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Component>;

const LessonOverviewFilesNeededComponent = (
  args: JSX.IntrinsicAttributes & {
    additionalFiles: string[];
    contentRestricted: boolean;
    showGeoBlocked: boolean;
    slugs: {
      lessonSlug: string;
      unitSlug: string | null;
      programmeSlug: string | null;
    };
  },
) => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Component {...args} />
    </OakThemeProvider>
  );
};

export const Default: Story = {
  args: {
    additionalFiles: ["file1 (pdf)"],
    contentRestricted: false,
    showGeoBlocked: false,
    slugs: {
      lessonSlug: "lesson-slug",
      unitSlug: "unit-slug",
      programmeSlug: "programme-slug",
    },
  },
  render: (args) => <LessonOverviewFilesNeededComponent {...args} />,
};

export const MultipleFiles: Story = {
  args: {
    additionalFiles: ["file1.pdf", "file2.pdf", "file3.pdf", "file4.pdf"],
    slugs: {
      lessonSlug: "lesson-slug",
      unitSlug: "unit-slug",
      programmeSlug: "programme-slug",
    },
  },
  render: (args) => <LessonOverviewFilesNeededComponent {...args} />,
};
