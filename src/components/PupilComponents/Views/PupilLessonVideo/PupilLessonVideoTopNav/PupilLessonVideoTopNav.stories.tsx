import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBackLink,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonVideoTopNav } from "./PupilLessonVideoTopNav";

const meta = {
  component: PupilLessonVideoTopNav,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonVideoTopNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    backLinkSlot: <OakBackLink href="#" label="Back to overview" />,
    heading: "Lesson video",
    mobileSummary: "In progress...",
  },
};
