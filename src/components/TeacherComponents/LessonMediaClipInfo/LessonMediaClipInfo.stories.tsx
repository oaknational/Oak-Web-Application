import type { Meta, StoryObj } from "@storybook/react";
import {
  OakP,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import {
  LessonMediaClipInfo,
  LessonMediaClipInfoProps,
} from "./LessonMediaClipInfo";

const props: LessonMediaClipInfoProps = {
  clipTitle: "How it is done",
  keyStageTitle: "KS 3",
  subjectTitle: "Maths",
  yearTitle: "Year 2",
  isMobile: false,
  videoTranscript: (
    <OakP>
      Hi, I'm Rebecca, your computing teacher for the collaborating online
      respectfully unit.
    </OakP>
  ),
};

const meta: Meta<typeof LessonMediaClipInfo> = {
  component: LessonMediaClipInfo,
};

export default meta;

type Story = StoryObj<typeof LessonMediaClipInfo>;

export const Standard: Story = {
  render: ({ ...args }) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <LessonMediaClipInfo {...args} />
    </OakThemeProvider>
  ),
  args: { ...props },
};
