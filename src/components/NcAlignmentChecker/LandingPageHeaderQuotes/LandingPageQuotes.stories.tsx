import type { Meta, StoryObj } from "@storybook/react";

import { basic } from "./LandingPageQuotes.fixtures";

import NcAlignmentCheckerLandingPageQuotes from ".";

const meta = {
  component: NcAlignmentCheckerLandingPageQuotes,
  tags: ["autodocs"],
  title: "Components/NcAlignmentChecker/LandingPageQuotes",
} satisfies Meta<typeof NcAlignmentCheckerLandingPageQuotes>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: { ...basic },
};
