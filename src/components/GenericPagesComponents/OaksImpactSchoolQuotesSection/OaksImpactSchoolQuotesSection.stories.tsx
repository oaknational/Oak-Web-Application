import { Meta, StoryObj } from "@storybook/react";

import { fixtureData } from "./OaksImpactSchoolQuotesSection.fixtures";

import { OaksImpactSchoolQuotesSection } from ".";

const meta = {
  component: OaksImpactSchoolQuotesSection,
  args: { ...fixtureData },
} satisfies Meta<typeof OaksImpactSchoolQuotesSection>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
