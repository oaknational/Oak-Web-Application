import type { Meta, StoryObj } from "@storybook/react";
import {
  oakDefaultTheme,
  OakFlex,
  OakP,
  OakPromoTag,
  OakThemeProvider,
} from "@oaknational/oak-components";

import PromoBanner from "./PromoBanner";

const meta: Meta<typeof PromoBanner> = {
  component: PromoBanner,
  argTypes: {
    background: {
      control: { type: "select" },
      options: [
        "lemon",
        "lemon30",
        "white",
        "black",
        "mint",
        "lavender",
        "pink",
      ],
    },
    ctaText: { control: "text" },
    message: {
      control: { type: "select" },
      options: ["curriculum", "mythbusting"],
      mapping: {
        curriculum: (
          <OakFlex>
            <OakPromoTag /> Subjects added
          </OakFlex>
        ),
        mythbusting: <OakP>Myths about teaching can hold you back</OakP>,
      },
      defaultValue: "curriculum",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PromoBanner>;

export const Banner: Story = {
  args: {
    ctaText: "See curriculum plans",
    background: "lemon",
    message: "curriculum",
  },
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <PromoBanner {...args} />
    </OakThemeProvider>
  ),
};
