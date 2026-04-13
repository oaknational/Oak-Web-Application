import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBackLink,
  OakP,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonIntroAdditionalFileItem } from "../PupilLessonIntro";

import { PupilLessonVideoView } from "./PupilLessonVideo.view";
import { PupilLessonVideoAdditionalFilesCard } from "./PupilLessonVideoAdditionalFilesCard";
import { PupilLessonVideoTranscript } from "./PupilLessonVideoTranscript";

const meta = {
  component: PupilLessonVideoView,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonVideoView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    topNav: {
      backLinkSlot: <OakBackLink href="#" label="Back to overview" />,
      heading: "Lesson video",
      mobileSummary: "In progress...",
    },
    bottomNav: {
      proceedLabel: "I've finished the video",
      onProceed: () => {},
    },
    videoSlot: (
      <OakP $font="body-1">Video player slot (render VideoPlayer here)</OakP>
    ),
    transcriptSlot: (
      <PupilLessonVideoTranscript
        transcriptSentences={[
          "This is the first sentence of the transcript.",
          "This is the second sentence of the transcript.",
        ]}
        showSignLanguageToggle
      />
    ),
    additionalFilesSlot: (
      <PupilLessonVideoAdditionalFilesCard
        hasAdditionalFiles
        filesCount={2}
        onDownload={() => {}}
        filesListSlot={
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
        }
      />
    ),
  },
};

export const NoTranscriptOrFiles: Story = {
  args: {
    topNav: {
      backLinkSlot: <OakBackLink href="#" label="Back to overview" />,
    },
    bottomNav: {
      proceedLabel: "Continue lesson",
      onProceed: () => {},
    },
    videoSlot: <OakP $font="body-1">This lesson does not contain a video</OakP>,
  },
};
