import { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { TakedownBanner } from "./TakedownBanner";

const meta: Meta<typeof TakedownBanner> = {
  component: TakedownBanner,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
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

export const EmailSignUpBanner: Story = {
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

// TODO
// export const LegacyCycle2TakedownNoNewContent: Story = {
//   render: (args) => <TakedownBanner {...args} />,
//   args: {
//     subjectSlug: "geography",
//     isExpiring: false,
//     isLegacy: true,
//     userType: "teacher",
//     hasNewUnits: false,
//     onButtonClick: () => console.log("click"),
//   },
// };
