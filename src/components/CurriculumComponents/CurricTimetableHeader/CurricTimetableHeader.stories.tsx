import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CurricTimetableHeader as Component } from ".";

import illustrations from "@/image-data/generated/illustrations.json";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  argTypes: {
    titleSlot: {
      type: "string",
      description: "String or ReactNode",
    },
    additionalSlot: {
      type: "string",
      description: "String or ReactNode",
    },
    illustrationSlug: {
      control: "select",
      options: Object.keys(illustrations),
    },
  },
  parameters: {
    controls: {
      include: ["titleSlot", "additionalSlot", "illustrationSlug"],
    },
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  render: (args) => <Component {...args} />,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    titleSlot: "Year 1 maths",
    illustrationSlug: "magic-carpet",
    additionalSlot: "Additional content goes here...",
  },
};
