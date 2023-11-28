import { NextPage } from "next";
import { oakDefaultTheme, OakThemeProvider } from "@oak-academy/oak-components";

import { QuizEngineProvider } from "@/components/PupilJourneyComponents/QuizEngineProvider/QuizEngineProvider";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import { QuizRenderer } from "@/components/PupilJourneyComponents/QuizRenderer/QuizRender";

const Pupils: NextPage = () => {
  const questionsArray = quizQuestions ?? [];
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <QuizEngineProvider questionsArray={questionsArray}>
        <QuizRenderer />
      </QuizEngineProvider>
    </OakThemeProvider>
  );
};

export default Pupils;
