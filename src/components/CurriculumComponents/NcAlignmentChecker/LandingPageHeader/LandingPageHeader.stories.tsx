import type { Meta, StoryObj } from "@storybook/react";

import NcAlignmentCheckerLandingPageHeader, { basic } from ".";

const meta = {
  component: NcAlignmentCheckerLandingPageHeader,
  tags: ["autodocs"],
  title: "Components/CurriculumComponents/NcAlignmentChecker/LandingPageHeader",
} satisfies Meta<typeof NcAlignmentCheckerLandingPageHeader>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: { ...basic },
};
