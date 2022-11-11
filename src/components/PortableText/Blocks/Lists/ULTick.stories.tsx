import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PortableText } from "@portabletext/react";

import Card from "../../../Card/Card";
import { Heading, P } from "../../../Typography";

import { ULTick as Component } from "./ULTick";

const bulletPortableText = [
  {
    _key: "ef36946e7316",
    _type: "block",
    children: [
      {
        _key: "70449613c203",
        _type: "span",
        marks: [],
        text: "Thousands of high-quality, sequenced lesson resources",
      },
    ],
    level: 1,
    listItem: "bullet",
    markDefs: [],
    style: "normal",
  },
  {
    _key: "8e806e5b4b95",
    _type: "block",
    children: [
      {
        _key: "29ecca398151",
        _type: "span",
        marks: [],
        text: "Downloadable and editable slides, worksheets and projectable quizzes",
      },
    ],
    level: 1,
    listItem: "bullet",
    markDefs: [],
    style: "normal",
  },
  {
    _key: "957e2f2f16d5",
    _type: "block",
    children: [
      {
        _key: "80fba6ce1ec1",
        _type: "span",
        marks: [],
        text: "All completely free to access; no impact on your budget",
      },
    ],
    level: 1,
    listItem: "bullet",
    markDefs: [],
    style: "normal",
  },
];

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
      <PortableText value={bulletPortableText} components={Component} />
    </Card>
  );
};

export const ULTick = Template.bind({});
ULTick.parameters = {};
