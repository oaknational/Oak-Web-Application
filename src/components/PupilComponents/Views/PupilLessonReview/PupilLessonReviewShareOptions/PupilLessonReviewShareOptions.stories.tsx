import type { Meta, StoryObj } from "@storybook/nextjs";

import { PupilLessonReviewShareOptions } from "./PupilLessonReviewShareOptions";

const meta = {
  component: PupilLessonReviewShareOptions,
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
