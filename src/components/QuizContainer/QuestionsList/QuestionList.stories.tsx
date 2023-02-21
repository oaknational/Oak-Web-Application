import { ComponentStory, ComponentMeta } from "@storybook/react";

import { QuizQuestionListProps } from "./QuestionsList";

import Component from ".";

export default {
  title: "Lists/Quiz question List",
  component: Component,
} as ComponentMeta<typeof Component>;

const questions: QuizQuestionListProps = {
  info: { title: "question title", questionCount: 2 },
  questions: [
    {
      keyStageSlug: "ks3",
      keyStageTitle: "Key stage 3",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      unitSlug: "maths",
      unitTitle: "Maths",
      title: "what is a question",
      points: 3,
      required: true,
      choices: ["this one", "that one"],
      active: true,
      answer: "this one",
      type: "multiple choice",
      quizType: "intro",
      images: [
        "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
      ],
      feedbackCorrect: "weldone",
      feedbackIncorrect: "unluckey",
      displayNumber: "Q1.",
      choiceImages: [
        "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
      ],
    },
  ],
};

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const QuizQuestionList = Template.bind({});

QuizQuestionList.args = questions;
