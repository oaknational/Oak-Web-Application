import { Meta, StoryObj } from "@storybook/react";

import JoinResearchPanelInfo from ".";

import { joinResearchPanelInfoBlockFixture } from "@/__tests__/pages/about-us/get-involved/join-research-panel.fixtures";

const meta = {
  component: JoinResearchPanelInfo,
  title: "Components/GenericPagesComponents/JoinResearchPanelInfo",
  tags: ["autodocs"],
} satisfies Meta<typeof JoinResearchPanelInfo>;

export default meta;

type Story = StoryObj<typeof JoinResearchPanelInfo>;

export const Default: Story = {
  args: joinResearchPanelInfoBlockFixture(
    "Who can join the panel?",
    "Join the research panel body copy goes here",
  ),
};

export const WithListItems: Story = {
  args: {
    ...joinResearchPanelInfoBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
    ),
    bodyRaw: [
      {
        _key: "687516f68a81",
        _type: "block",
        children: [
          {
            _key: "23f24a9d62d8",
            _type: "span",
            marks: [],
            text: "We’re keen to hear from a wide range of teachers across the UK.\n",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "9bee3375fa97",
        _type: "block",
        children: [
          {
            _key: "25fc52b413cf",
            _type: "span",
            marks: [],
            text: "Primary and secondary teachers at any stage of your career, including trainees and early career teachers.",
          },
        ],
        level: 1,
        listItem: "bullet",
        markDefs: [],
        style: "normal",
      },
      {
        _key: "a23ec7beb005",
        _type: "block",
        children: [
          {
            _key: "88a004205a52",
            _type: "span",
            marks: [],
            text: "You don't need to use Oak resources to take part.",
          },
        ],
        level: 1,
        listItem: "bullet",
        markDefs: [],
        style: "normal",
      },
      {
        _key: "42336d8b6fbb",
        _type: "block",
        children: [
          {
            _key: "daabd4c81e16",
            _type: "span",
            marks: [],
            text: "We welcome teachers from all backgrounds, experiences and school settings, and want our panel to reflect the diversity of the communities you serve.",
          },
        ],
        level: 1,
        listItem: "bullet",
        markDefs: [],
        style: "normal",
      },
      {
        _key: "9961d6073652",
        _type: "block",
        children: [
          {
            _key: "67c21dc43794",
            _type: "span",
            marks: [],
            text: "Some studies may focus on specific subjects, roles or experiences. If that’s the case, we’ll always make this clear when inviting you to take part.",
          },
        ],
        level: 1,
        listItem: "bullet",
        markDefs: [],
        style: "normal",
      },
    ],
  },
};
