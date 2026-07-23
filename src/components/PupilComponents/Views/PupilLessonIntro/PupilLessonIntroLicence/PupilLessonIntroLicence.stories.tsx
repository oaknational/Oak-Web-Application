import type { Meta, StoryObj } from "@storybook/nextjs";

import { PupilLessonIntroLicence } from "./PupilLessonIntroLicence";

const meta = {
  component: PupilLessonIntroLicence,
} satisfies Meta<typeof PupilLessonIntroLicence>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLegacyLicense: false,
  },
};

export const Legacy: Story = {
  args: {
    isLegacyLicense: true,
  },
};
