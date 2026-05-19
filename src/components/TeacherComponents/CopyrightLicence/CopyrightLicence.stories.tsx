import type { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import CopyrightLicence from "./CopyrightLicence";

const meta = {
  component: CopyrightLicence,
  tags: ["autodocs"],
  parameters: {
    controls: {
      include: ["copyrightYear", "openLinksExternally"],
    },
  },
  argTypes: {
    copyrightYear: {
      control: {
        type: "date",
      },
    },
    openLinksExternally: {
      control: {
        type: "boolean",
      },
    },
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof CopyrightLicence>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    copyrightYear: "2024-01-01T00:00:00Z",
    openLinksExternally: true,
  },
} satisfies Story;
