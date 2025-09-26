import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilExpiredView } from "./PupilExpired.view";

const meta = {
  component: PupilExpiredView,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      include: [],
    },
  },
} satisfies Meta<typeof PupilExpiredView>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * This is the view users will see on encountering an expired lesson
 *
 */

export const Default: Story = {
  render: (args) => {
    return <PupilExpiredView lessonTitle={args.lessonTitle} />;
  },
  args: { lessonTitle: "The lesson title" },
};
