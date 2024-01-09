import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { bodyPortableText } from "../../../Sanity/TextBlock/TextBlockCard.stories";
import { PortableTextWithDefaults } from "../../PortableText";

import { ULTick as Component } from "./ULTick";

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

export const ULTick = Template.bind({});
ULTick.parameters = {};
