import { Meta, StoryObj } from "@storybook/nextjs";
import { OakSpan } from "@oaknational/oak-components";

import Component from "./SubjectListingTextTile";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const SubjectListingTextTile: Story = {
  args: {
    $background: "white",
  },
  render: (args) => (
    <Component {...args}>
      <OakSpan>Content dropped in as children</OakSpan>
    </Component>
  ),
};
