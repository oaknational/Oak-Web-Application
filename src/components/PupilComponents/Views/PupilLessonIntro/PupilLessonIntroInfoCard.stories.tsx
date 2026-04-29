import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakP,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonIntroInfoCard } from "./PupilLessonIntroInfoCard";

const meta = {
  component: PupilLessonIntroInfoCard,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonIntroInfoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Equipment: Story = {
  args: {
    title: "Equipment",
    iconName: "equipment-required",
    children: <OakP $font="body-1">Pen, paper, and ruler.</OakP>,
  },
};
