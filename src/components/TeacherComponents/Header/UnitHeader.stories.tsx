import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { Header } from "./Header";
import UnitHeader from "./UnitHeader";

const meta: Meta<typeof UnitHeader> = {
  component: UnitHeader,
  tags: ["autodocs"],
  argTypes: {
    background: {
      control: {
        type: "select",
      },
      options: [
        undefined,
        "bg-decorative1-very-subdued",
        "bg-decorative2-very-subdued",
        "bg-decorative3-very-subdued",
        "bg-decorative4-very-subdued",
        "bg-decorative5-very-subdued",
        "bg-decorative6-very-subdued",
      ],
    },
    summary: {
      control: {
        type: "text",
      },
    },
    bullets: {
      control: {
        type: "object",
      },
    },
  },
  parameters: {
    controls: {
      include: ["background"],
    },
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    heading: "English Primary",
  },
};
