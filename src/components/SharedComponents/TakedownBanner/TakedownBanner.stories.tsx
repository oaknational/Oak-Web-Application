import { Meta, StoryObj } from "@storybook/nextjs";

import { TakedownBanner } from "./TakedownBanner";

const meta: Meta<typeof TakedownBanner> = {
  component: TakedownBanner,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TakedownBanner>;

export const LegacyCycle1ExpiryTeacher: Story = {
  render: (args) => <TakedownBanner {...args} />,
  args: {
    subjectSlug: "maths",
    isExpiring: true,
    isLegacy: true,
    userType: "teacher",
    hasNewUnits: true,
    onButtonClick: () => console.log("click"),
  },
};

export const LegacyCycle1ExpiryPupil: Story = {
  render: (args) => <TakedownBanner {...args} />,
  args: {
    subjectSlug: "maths",
    isExpiring: true,
    isLegacy: true,
    userType: "pupil",
    hasNewUnits: true,
  },
};

export const LegacyCycle2TakedownTeacher: Story = {
  render: (args) => <TakedownBanner {...args} />,
  args: {
    subjectSlug: "geography",
    isExpiring: false,
    isLegacy: true,
    userType: "teacher",
    hasNewUnits: true,
    onButtonClick: () => console.log("click"),
  },
};

export const LegacyCycle2TakedownPupil: Story = {
  render: (args) => <TakedownBanner {...args} />,
  args: {
    subjectSlug: "geography",
    isExpiring: false,
    isLegacy: true,
    userType: "pupil",
    hasNewUnits: true,
    onButtonClick: () => console.log("click"),
  },
};

export const LegacyCycle1ExpiryNoNewContent: Story = {
  render: (args) => <TakedownBanner {...args} />,
  args: {
    subjectSlug: "maths",
    isExpiring: true,
    isLegacy: true,
    userType: "teacher",
    hasNewUnits: false,
    onButtonClick: () => console.log("click"),
  },
};

export const TODOLegacyCycle2TakedownNoNewContent: Story = {
  render: (args) => <TakedownBanner {...args} />,
  args: {
    subjectSlug: "geography",
    isExpiring: false,
    isLegacy: true,
    userType: "teacher",
    hasNewUnits: false,
    onButtonClick: () => console.log("click"),
  },
};
