// import type { Meta, StoryObj } from "@storybook/react";
// import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

// import { QuizResultQuestionStem } from "./QuizResultQuestionStem";

// import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

// const meta: Meta<typeof QuizResultQuestionStem> = {
//   component: QuizResultQuestionStem,
//   decorators: [
//     (Story) => (
//       <OakThemeProvider theme={oakDefaultTheme}>
//         <Story />
//       </OakThemeProvider>
//     ),
//   ],

//   argTypes: {},
// } as Meta;

// export default meta;

// type Story = StoryObj<typeof meta>;

// const starterQuiz = quizQuestions;
// const mcqText = starterQuiz ? starterQuiz[0] : null;
// const mcqStemImage = starterQuiz ? starterQuiz[1] : null;

// /*
//  * This is the view users will see on encountering an expired lesson
//  *
//  */

// export const Default: Story = {
//   render: (args) => {
//     return <QuizResultQuestionStem {...args} />;
//   },
//   args: {
//     questionStem: mcqText?.questionStem || [],
//     displayIndex: 1,
//   },
// };

// export const Text: Story = {
//   render: (args) => {
//     return <QuizResultQuestionStem {...args} />;
//   },
//   args: {
//     questionStem: mcqText?.questionStem || [],
//     displayIndex: 1,
//   },
// };

// export const Image: Story = {
//   render: (args) => {
//     return <QuizResultQuestionStem {...args} />;
//   },
//   args: {
//     questionStem: mcqStemImage?.questionStem || [],
//     displayIndex: 1,
//   },
// };
