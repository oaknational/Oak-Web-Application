import type { Meta, StoryObj } from "@storybook/react";

import { basic } from "./LandingPageHeader.fixtures";

import NcAlignmentCheckerLandingPageHeader from ".";

const meta = {
  component: NcAlignmentCheckerLandingPageHeader,
  tags: ["autodocs"],
  title: "Components/NcAlignmentChecker/LandingPageHeader",
} satisfies Meta<typeof NcAlignmentCheckerLandingPageHeader>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: { ...basic },
};
