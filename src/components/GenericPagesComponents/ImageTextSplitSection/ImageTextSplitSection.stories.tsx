import { Meta, StoryObj } from "@storybook/react";

import {
  imageTextSplitSectionBlockFixture,
  imageTextSplitSectionWithBulletListFixture,
  imageTextSplitSectionWithNumberedListFixture,
  imageTextSplitSectionWithLinkFixture,
} from "./ImageTextSplitSection.fixtures";

import ImageTextSplitSection from ".";

const meta = {
  component: ImageTextSplitSection,
  title: "Components/GenericPagesComponents/ImageTextSplitSection",
  tags: ["autodocs"],
} satisfies Meta<typeof ImageTextSplitSection>;

export default meta;

type Story = StoryObj<typeof ImageTextSplitSection>;

export const Default: Story = {
  args: imageTextSplitSectionBlockFixture(
    "Who can join the panel?",
    "Join the research panel body copy goes here",
  ),
};

export const WithRightPositionedImage: Story = {
  args: {
    ...imageTextSplitSectionBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
    ),
    imagePosition: "right",
  },
};
export const WithBulletList: Story = {
  args: imageTextSplitSectionWithBulletListFixture(),
};

export const WithNumberedList: Story = {
  args: imageTextSplitSectionWithNumberedListFixture(),
};

export const WithLink: Story = {
  args: imageTextSplitSectionWithLinkFixture(),
};
