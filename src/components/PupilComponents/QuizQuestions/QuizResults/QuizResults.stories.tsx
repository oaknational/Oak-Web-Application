import type { Meta, StoryObj } from "@storybook/nextjs";

import { QuizResults, type QuizResultsProps } from "./QuizResults";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { exitQuizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";

const meta: Meta<typeof QuizResults> = {
  title: "Components/PupilComponents/QuizQuestions/QuizResults",
  component: QuizResults,
  decorators: [
    (StoryComponent) => (
      <MathJaxProvider>
        <StoryComponent />
      </MathJaxProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<QuizResultsProps>;

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
    sectionResults: sectionResultsFixture,
    lessonSection: "exit-quiz",
  },
};
