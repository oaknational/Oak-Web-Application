import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TextBlockCard as Component } from "./TextBlockCard";

export const bodyPortableText = [
  {
    _key: "f4b422515ecb",
    _type: "block",
    children: [
      {
        _key: "2fc17246dfe10",
        _type: "span",
        marks: [],
        text: "Using Oak as a foundation for lesson planning can save teachers three hours per week; that’s the equivalent of three weeks a year.",
      },
    ],
    markDefs: [],
    style: "normal",
  },
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
];

export default {
  title: "Sanity/Blocks/TextBlock",
  component: Component,
  argTypes: {
    $background: {
      defaultValue: "lemon50",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const TextBlockCardULTick = Template.bind({});
TextBlockCardULTick.args = {
  background: "lemon50",
  title: "Card title",
  bodyPortableText: bodyPortableText,
};
