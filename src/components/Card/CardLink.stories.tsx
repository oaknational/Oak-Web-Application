import type { Meta, StoryObj } from "@storybook/react";

import { Heading, P } from "../Typography";

import Card from "./Card";
import Component from "./CardLink";

const meta: Meta<typeof Component> = {
  title: "Cards/Card Link",
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CardLink: Story = {
  render: () => (
    <Card $background={"grey4"}>
      <Heading
        $mt={24}
        $mb={12}
        $font={"heading-5"}
        tag={"h5"}
        $color={"grey8"}
      >
        <Component page="home" viewType={"teachers"}>
          Card link
        </Component>
      </Heading>
      <P>
        Drop a CardLink component into a Card, pass in an href and the whole
        card becomes a link. The CardLink should be the child of a Heading to
        ensure the Heading is focusable
      </P>
    </Card>
  ),
};
