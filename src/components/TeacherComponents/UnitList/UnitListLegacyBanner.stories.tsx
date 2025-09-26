import type { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import {
  UnitListLegacyBanner,
  UnitListLegacyBannerProps,
} from "./UnitListLegacyBanner";

import unitListingFixture from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

const unitListing = unitListingFixture();

const allLegacyUnits: UnitListLegacyBannerProps["allLegacyUnits"] =
  unitListing.units;

const getLegacyUnits = (
  addExpiringBannerAction: boolean,
): UnitListLegacyBannerProps["allLegacyUnits"] => {
  if (!addExpiringBannerAction) return allLegacyUnits;
  const exampleUnit = allLegacyUnits?.[0]?.[0];
  let groupToPrepend: UnitListLegacyBannerProps["allLegacyUnits"][number] = [];
  if (exampleUnit) {
    const bannerUnit = {
      ...exampleUnit,
      actions: { displayExpiringBanner: true },
    };
    groupToPrepend = [bannerUnit];
  }
  return [
    groupToPrepend,
    ...allLegacyUnits,
  ] as UnitListLegacyBannerProps["allLegacyUnits"];
};

const meta: Meta<typeof UnitListLegacyBanner> = {
  component: UnitListLegacyBanner,
  decorators: [
    AnalyticsDecorator,
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof UnitListLegacyBanner>;

export const AnyLegacyWithNoExpiry: Story = {
  name: "Pupil or teacher where legacy unit is not expiring",
  render: ({ ...args }) => <UnitListLegacyBanner {...args} />,
  args: {
    allLegacyUnits: getLegacyUnits(false),
    userType: "teacher",
    hasNewUnits: true,
    onButtonClick: () => console.log("Button clicked"),
  },
};

export const TeacherNewUnitsAvailable: Story = {
  name: "Teacher view where new units are available",
  render: ({ ...args }) => <UnitListLegacyBanner {...args} />,
  args: {
    allLegacyUnits: getLegacyUnits(true),
    userType: "teacher",
    hasNewUnits: true,
    onButtonClick: () => console.log("Button clicked"),
  },
};

export const TeacherNoNewUnitsAvailable: Story = {
  name: "Teacher view where no new units are available",
  render: ({ ...args }) => <UnitListLegacyBanner {...args} />,
  args: {
    allLegacyUnits: getLegacyUnits(true),
    userType: "teacher",
    hasNewUnits: false,
  },
};

export const PupilNewUnitsAvailable: Story = {
  name: "Pupil view where new units are available",
  render: ({ ...args }) => <UnitListLegacyBanner {...args} />,
  args: {
    allLegacyUnits: getLegacyUnits(true),
    userType: "pupil",
    hasNewUnits: true,
  },
};

export const PupilNoNewUnitsAvailable: Story = {
  name: "Pupil view where no new units are available",
  render: ({ ...args }) => <UnitListLegacyBanner {...args} />,
  args: {
    allLegacyUnits: getLegacyUnits(true),
    userType: "pupil",
    hasNewUnits: false,
  },
};
