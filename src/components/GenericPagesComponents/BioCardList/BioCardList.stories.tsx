import type { Meta, StoryObj } from "@storybook/nextjs";
import { OverlayProvider } from "react-aria";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const BioCardList: Story = {
  args: {
    bios: [
      "Jack",
      "Joe",
      "Craig",
      "Verity",
      "Mitch",
      "Tomas",
      "Jim",
      "Ross",
      "Ian",
      "Matt",
    ].map((name, i) => ({ name, id: String(i), role: "Worker" })),
  },
  render: (args) => (
    <OverlayProvider>
      <Component {...args} />
    </OverlayProvider>
  ),
};
