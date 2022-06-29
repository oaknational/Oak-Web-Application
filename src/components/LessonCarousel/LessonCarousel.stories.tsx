import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { LessonCarouselProps } from "./LessonCarousel";

import Component from ".";

const unit: LessonCarouselProps["unit"] = [
  {
    lessonTitle: "Historical Context: James I, Witchcraft and Regicide",
    keyStage: "KS3",
    subject: "English",
    topic: "Macbeth",
    index: 1,
  },
  {
    lessonTitle: "Historical Context: James I, Witchcraft and Regicide",
    keyStage: "KS3",
    subject: "English",
    topic: "Macbeth",
    index: 2,
  },
  {
    lessonTitle: "Historical Context: James I, Witchcraft and Regicide",
    keyStage: "KS3",
    subject: "English",
    topic: "Macbeth",
    index: 3,
  },
  {
    lessonTitle: "Historical Context: James I, Witchcraft and Regicide",
    keyStage: "KS3",
    subject: "English",
    topic: "Macbeth",
    index: 4,
  },
  {
    lessonTitle: "Historical Context: James I, Witchcraft and Regicide",
    keyStage: "KS3",
    subject: "English",
    topic: "Macbeth",
    index: 5,
  },
  {
    lessonTitle: "Historical Context: James I, Witchcraft and Regicide",
    keyStage: "KS3",
    subject: "English",
    topic: "Macbeth",
    index: 6,
  },
  {
    lessonTitle: "Historical Context: James I, Witchcraft and Regicide",
    keyStage: "KS3",
    subject: "English",
    topic: "Macbeth",
    index: 7,
  },
  {
    lessonTitle: "Historical Context: James I, Witchcraft and Regicide",
    keyStage: "KS3",
    subject: "English",
    topic: "Macbeth",
    index: 8,
  },
];

export default {
  title: "Lists/Lesson Carousel",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} unit={unit}></Component>;
};

export const LessonCarousel = Template.bind({});
