import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./LessonResourceGraphics";

export default {
  title: "Element/Lesson Resource Graphic ",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const LessonResourceGraphic = Template.bind({});

LessonResourceGraphic.args = {
  items: [
    {
      titleSingular: "Slide deck",
      titlePlural: "Slide decks",
      icon: "slide-deck",
      resourceCount: 1,
    },
    {
      titleSingular: "Worksheet",
      titlePlural: "Worksheets",
      icon: "worksheet",
      resourceCount: 2,
    },
    {
      titleSingular: "Quiz",
      titlePlural: "Quizzes",
      icon: "quiz",
      resourceCount: 3,
    },
    {
      titleSingular: "Video",
      titlePlural: "Videos",
      icon: "video",
      resourceCount: 2,
    },
  ],
};
export const LessonResourceGraphicMissing = Template.bind({});

LessonResourceGraphicMissing.args = {
  items: [
    {
      titleSingular: "Slide deck",
      titlePlural: "Slide decks",
      icon: "slide-deck",
      resourceCount: 1,
    },

    {
      titleSingular: "Quiz",
      titlePlural: "Quizzes",
      icon: "quiz",
      resourceCount: 2,
    },
  ],
};
