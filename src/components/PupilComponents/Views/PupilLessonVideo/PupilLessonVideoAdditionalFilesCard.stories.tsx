import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonIntroAdditionalFileItem } from "../PupilLessonIntro";

import { PupilLessonVideoAdditionalFilesCard } from "./PupilLessonVideoAdditionalFilesCard";

const meta = {
  component: PupilLessonVideoAdditionalFilesCard,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonVideoAdditionalFilesCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hasAdditionalFiles: true,
    filesCount: 2,
    onDownload: () => {},
    filesListSlot: (
      <>
        <PupilLessonIntroAdditionalFileItem
          displayName="Worksheet"
          bytes={1_400_000}
          url="https://example.org/worksheet.pdf"
        />
        <PupilLessonIntroAdditionalFileItem
          displayName="Vocabulary list"
          bytes={650_000}
          url="https://example.org/vocabulary.docx"
        />
      </>
    ),
  },
};

export const Hidden: Story = {
  args: {
    hasAdditionalFiles: false,
    filesCount: 0,
    onDownload: () => {},
  },
};
