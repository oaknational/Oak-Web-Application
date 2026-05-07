import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonReviewShareOptions } from "./PupilLessonReviewShareOptions";

const meta = {
  component: PupilLessonReviewShareOptions,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonReviewShareOptions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showPrintable: true,
    printableHref: "#",
    onCopyLink: () => {},
    shareState: "initial",
  },
};

export const Shared: Story = {
  args: {
    showPrintable: true,
    printableHref: "#",
    onCopyLink: () => {},
    shareState: "shared",
  },
};

export const Failed: Story = {
  args: {
    showPrintable: true,
    printableHref: "#",
    onCopyLink: () => {},
    shareState: "failed",
  },
};
