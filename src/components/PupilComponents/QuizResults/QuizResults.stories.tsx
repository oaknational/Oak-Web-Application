import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizResults } from "./QuizResults";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import {
  exitQuizQuestions,
  sectionResults,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const meta: Meta<typeof QuizResults> = {
  component: QuizResults,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <Story />
        </OakThemeProvider>
      </MathJaxProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * This is the view for the quiz results
 *
 */

export const Default: Story = {
  render: (args) => {
    return <QuizResults {...args} />;
  },
  args: {
    quizArray: exitQuizQuestions,
    sectionResults: sectionResults,
    lessonSection: "exit-quiz",
  },
} as Story; // Add the type definition here
