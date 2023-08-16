import { Meta, StoryObj } from "@storybook/react";

import { HeaderLessonProps } from "./HeaderLesson";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

const props = {
  breadcrumbs: [
    {
      oakLinkProps: {
        page: "home",
        viewType: "teachers",
      },
      label: "Home",
    },
    {
      oakLinkProps: {
        page: "subject-index",
        viewType: "teachers",
        keyStageSlug: "ks1",
      },
      label: "Key Stage 1",
    },
    {
      oakLinkProps: {
        page: "unit-index",
        viewType: "teachers",
        programmeSlug: "history-primary-ks1",
      },
      label: "History",
    },
    {
      oakLinkProps: {
        page: "lesson-index",
        viewType: "teachers",
        programmeSlug: "history-primary-ks1",
        unitSlug:
          "unit-title-toys-and-games-what-can-toys-tell-us-about-the-past",
      },
      label: "Toys and Games: what can toys tell us about the past?",
    },
    {
      oakLinkProps: {
        page: "lesson-overview",
        viewType: "teachers",
        programmeSlug: "history-primary-ks1",
        unitSlug:
          "unit-title-toys-and-games-what-can-toys-tell-us-about-the-past",
        lessonSlug: "playing-games",
      },
      label: "Playing games",
      disabled: true,
    },
  ],
  background: "pink30",
  subjectIconBackgroundColor: "pink",
  lessonSlug: "playing-games",
  lessonTitle: "Playing games",
  programmeSlug: "history-primary-ks1",
  unitSlug: "unit-title-toys-and-games-what-can-toys-tell-us-about-the-past",
  unitTitle: "Toys and Games: what can toys tell us about the past?",
  keyStageSlug: "ks1",
  keyStageTitle: "Key Stage 1",
  subjectSlug: "history",
  subjectTitle: "History",
  contentGuidance: null,
  misconceptionsAndCommonMistakes: [
    {
      misconception: "",
      response: "",
    },
  ],
  teacherTips: null,
  lessonEquipmentAndResources: null,
  keyLearningPoints: [
    {
      keyLearningPoint:
        "Playing is important for helping children to develop their imagination and creativity and to learn.",
    },
    {
      keyLearningPoint:
        "Children can play physical games with their friends e.g  playing tag or hide and seek.",
    },
    {
      keyLearningPoint:
        "Children can play with different types of toys and games. ",
    },
  ],
  pupilLessonOutcome: "You can identify how today’s children play.",
  lessonKeywords: [
    {
      keyword: "imagination",
      description:
        "When you have ideas of pictures of things that are not real or you haven't seen you are using your imagination.",
    },
    {
      keyword: "physical",
      description: "Something is physical when it involves your body.",
    },
    {
      keyword: "creativity",
      description:
        "Using your imagination to make new things or have new ideas is called creativity.",
    },
  ],
  copyrightContent: null,
  supervisionLevel: null,
  worksheetUrl: null,
  presentationUrl: null,
  videoMuxPlaybackId: null,
  videoWithSignLanguageMuxPlaybackId: null,
  transcriptSentences: null,
  isWorksheetLandscape: false,
  hasDownloadableResources: true,
  hasCopyrightMaterial: false,
  yearTitle: "Year 1",
  introQuiz: [],
  exitQuiz: [],
  introQuizInfo: null,
  exitQuizInfo: null,
  expired: false,
  lessonIsNew: true,
};

const meta: Meta<typeof Component> = {
  title: "Headers & Footers/HeaderLesson",
  decorators: [AnalyticsDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const HeaderLesson: Story = {
  args: {
    ...(props as unknown as HeaderLessonProps),
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
