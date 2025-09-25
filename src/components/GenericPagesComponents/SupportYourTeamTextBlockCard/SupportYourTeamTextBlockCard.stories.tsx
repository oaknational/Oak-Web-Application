import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import { SupportYourTeamTextBlockCard as Component } from "./SupportYourTeamTextBlockCard";

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
  component: Component,
  argTypes: {
    $background: {
      defaultValue: "lemon50",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const SupportYourTeamTextBlockCard = {
  render: Template,

  args: {
    background: "lemon50",
    title: "Card title",
    bodyPortableText: bodyPortableText,
  },
};
