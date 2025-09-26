import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import {
  QuizResultQuestionStem,
  type QuizQuestionStemProps,
} from "./QuizResultQuestionStem";

import type {
  ImageItem,
  TextItem,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";

const meta: Meta<typeof QuizResultQuestionStem> = {
  component: QuizResultQuestionStem,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <Story />
        </OakThemeProvider>
      </MathJaxProvider>
    ),
  ],

  argTypes: {},
};

export default meta;

type Story = StoryObj<QuizQuestionStemProps>;

const starterQuiz = quizQuestions;
const mcqText = starterQuiz ? starterQuiz[0] : null;
const mcqStemImage = starterQuiz ? starterQuiz[1] : null;

// Define a sample question stem to ensure type correctness
const sampleQuestionStem: (ImageItem | TextItem)[] = [
  { type: "text", text: "This is a sample question text." },
];

/*
 * This is the view users will see on encountering an expired lesson
 *
 */

export const Default: Story = {
  render: (args) => {
    return <QuizResultQuestionStem {...args} />;
  },
  args: {
    questionStem: sampleQuestionStem,
    displayIndex: 1,
  },
};

export const Text: Story = {
  render: (args) => {
    return <QuizResultQuestionStem {...args} />;
  },
  args: {
    questionStem: mcqText?.questionStem || sampleQuestionStem,
    displayIndex: 1,
  },
};

export const Image: Story = {
  render: (args) => {
    return <QuizResultQuestionStem {...args} />;
  },
  args: {
    questionStem: mcqStemImage?.questionStem || sampleQuestionStem,
    displayIndex: 1,
  },
};
