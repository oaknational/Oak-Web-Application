import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";
import { OakHeading, OakP } from "@oaknational/oak-components";

import { SupportYourTeamTextBlockCardULTick as Component } from "./SupportYourTeamTextBlockCardULTick";

import { bodyPortableText } from "@/components/GenericPagesComponents/SupportYourTeamTextBlockCard/SupportYourTeamTextBlockCard.stories";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import Card from "@/components/SharedComponents/Card";

export default {
  component: Card,

  argTypes: {
    $background: {
      defaultValue: "lemon50",
    },
  },
} as Meta<typeof Card>;

/**
 * This portable text block will turn bullet points into ticks.
 * ## Usage
 * Pass this into the components prop in the PortableText component.
 */
const Template: StoryFn<typeof Card> = (args) => {
  return (
    <Card {...args}>
      <OakHeading $mb="space-between-m" $font={"heading-5"} tag={"h2"}>
        UL with tick icons
      </OakHeading>
      <OakP $mb="space-between-m">
        Pass ULTick into the component prop of a PortableText component and
        bullet points become ticks.
      </OakP>
      <PortableTextWithDefaults
        value={bodyPortableText}
        components={Component}
      />
    </Card>
  );
};

export const SupportYourTeamTextBlockCardULTick = {
  render: Template,
  parameters: {},
};
