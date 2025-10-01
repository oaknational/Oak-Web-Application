import { Meta, StoryObj } from "@storybook/nextjs";

import { HeaderListingProps } from "./HeaderListing";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export const headerListingProps = {
  breadcrumbs: [
    {
      oakLinkProps: {
        page: "home",
      },
      label: "Home",
    },
    {
      oakLinkProps: {
        page: "subject-index",
        keyStageSlug: "ks4",
      },
      label: "Key Stage 4",
    },
    {
      oakLinkProps: {
        page: "programme-index",
        subjectSlug: "english",
        keyStageSlug: "ks4",
      },
      label: "English",
    },
  ],
  background: "lavender30",
  subjectIconBackgroundColor: "lavender",
  title: "English",
  programmeFactor: "Key Stage 4",
  keyStageTitle: "Key Stage 4",
  keyStageSlug: "ks4",
  subjectSlug: "english",
  subjectTitle: "English",
  programmes: [
    {
      programmeSlug: "english-secondary-ks4-aqa",
      subjectTitle: "English",
      unitCount: 22,
      lessonCount: 482,
      tierSlug: null,
      tierTitle: null,
      tierDisplayOrder: null,
      examBoardSlug: "aqa",
      examBoardTitle: "AQA",
      examBoardDisplayOrder: "1",
    },
    {
      programmeSlug: "english-secondary-ks4-edexcel",
      subjectTitle: "English",
      unitCount: 22,
      lessonCount: 438,
      tierSlug: null,
      tierTitle: null,
      tierDisplayOrder: null,
      examBoardSlug: "edexcel",
      examBoardTitle: "Edexcel",
      examBoardDisplayOrder: "2",
    },
  ],
};

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const HeaderLesson: Story = {
  args: {
    ...(headerListingProps as unknown as HeaderListingProps),
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
