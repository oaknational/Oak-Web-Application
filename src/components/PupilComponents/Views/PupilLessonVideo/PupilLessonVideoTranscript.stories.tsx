import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonVideoTranscript } from "./PupilLessonVideoTranscript";

const meta = {
  component: PupilLessonVideoTranscript,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonVideoTranscript>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    transcriptSentences: [
      "This is the first sentence of the transcript.",
      "This is the second sentence of the transcript.",
    ],
    showSignLanguageToggle: true,
    signLanguageOn: false,
    onSignLanguageToggle: () => {},
  },
};

export const Empty: Story = {
  args: {
    transcriptSentences: [],
  },
};
