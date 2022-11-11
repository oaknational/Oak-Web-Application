import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TextBlockCard as Component } from "./TextBlockCard";

const bodyPortableText = [
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
  title: "Sanity/Blocks/TextBlock",
  component: Component,
  argTypes: {
    $background: {
      defaultValue: "teachersPastelYellow",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const TextBlockCardULTick = Template.bind({});
TextBlockCardULTick.args = {
  background: "teachersPastelYellow",
  title: "Card title",
  bodyPortableText: bodyPortableText,
};
