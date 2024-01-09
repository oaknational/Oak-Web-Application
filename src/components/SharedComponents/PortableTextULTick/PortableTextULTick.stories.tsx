import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PortableTextULTick as Component } from "./PortableTextULTick";

import { bodyPortableText } from "@/components/Sanity/TextBlock/TextBlockCard.stories";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { Heading, P } from "@/components/SharedComponents/Typography";
import Card from "@/components/SharedComponents/Card";

export default {
  component: Card,

  argTypes: {
    $background: {
      defaultValue: "lemon50",
    },
  },
} as ComponentMeta<typeof Card>;

/**
 * This portable text block will turn bullet points into ticks.
 * ## Usage
 * Pass this into the components prop in the PortableText component.
 */
const Template: ComponentStory<typeof Card> = (args) => {
  return (
    <Card {...args}>
      <Heading $mb={24} $font={"heading-5"} tag={"h2"}>
        UL with tick icons
      </Heading>
      <P $mb={24}>
        Pass ULTick into the component prop of a PortableText component and
        bullet points become ticks.
      </P>
      <PortableTextWithDefaults
        value={bodyPortableText}
        components={Component}
      />
    </Card>
  );
};

export const PortableTextULTick = Template.bind({});
PortableTextULTick.parameters = {};
