import { NextPage } from "next";
import { ThemeProvider, DefaultTheme } from "styled-components";
import { oakDefaultTheme, OakTheme } from "@oak-academy/oak-components";

import { QuizEngineProvider } from "@/components/PupilJourneyComponents/QuizEngineProvider/QuizEngineProvider";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import { QuizRenderer } from "@/components/PupilJourneyComponents/QuizRenderer/QuizRender";

type OakThemeExtened = OakTheme & DefaultTheme;
const Pupils: NextPage = () => {
  const questionsArray = quizQuestions || [];
  return (
    <ThemeProvider theme={oakDefaultTheme as OakThemeExtened}>
      <QuizEngineProvider questionsArray={questionsArray}>
        <QuizRenderer />
      </QuizEngineProvider>
    </ThemeProvider>
  );
};

export default Pupils;
