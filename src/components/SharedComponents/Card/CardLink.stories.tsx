import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakHeading, OakP } from "@oaknational/oak-components";

import Card from "./Card";
import Component from "./CardLink";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CardLink: Story = {
  render: () => (
    <Card $background={"grey40"}>
      <OakHeading
        $mt={"space-between-m"}
        $mb={"space-between-xs"}
        $font={"heading-5"}
        tag={"h5"}
        $color={"grey70"}
      >
        <Component page="home">Card link</Component>
      </OakHeading>
      <OakP>
        Drop a CardLink component into a Card, pass in an href and the whole
        card becomes a link. The CardLink should be the child of a Heading to
        ensure the Heading is focusable
      </OakP>
    </Card>
  ),
};
