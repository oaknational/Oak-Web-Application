import { useContext } from "react";

import { quizEngineContext } from "./QuizEngineProvider";

const useQuizEngineContext = () => {
  const quizEngineValue = useContext(quizEngineContext);

  if (!quizEngineValue) {
    throw new Error("useMenuContext() called outside of menu provider");
  }

  return quizEngineValue;
};

export default useQuizEngineContext;
