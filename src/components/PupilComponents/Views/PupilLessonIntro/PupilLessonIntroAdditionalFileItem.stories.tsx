import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakThemeProvider,
  OakUL,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonIntroAdditionalFileItem } from "./PupilLessonIntroAdditionalFileItem";

const meta = {
  component: PupilLessonIntroAdditionalFileItem,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakUL $reset>
          <StoryComponent />
        </OakUL>
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonIntroAdditionalFileItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    displayName: "Worksheet",
    bytes: 1_400_000,
    url: "https://example.org/worksheet.pdf",
  },
};
