import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Card from "../../../Card/Card";
import { Heading, P } from "../../../Typography";
import { bodyPortableText } from "../../../Sanity/TextBlock/TextBlockCard.stories";
import { PortableTextWithDefaults } from "../../PortableText";

import { ULTick as Component } from "./ULTick";

export default {
  title: "Sanity/PortableText/Lists",
  component: Card,

  argTypes: {
    $background: {
      defaultValue: "teachersPastelYellow",
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
