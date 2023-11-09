const exitQuiz = {
  type: "exit-quiz-questions" as const,
  exists: true,
  label: "Exit quiz",
  metadata: "6 questions",
};
const starterQuiz = {
  type: "intro-quiz-questions" as const,
  exists: true,
  label: "Starter quiz",
  metadata: "6 questions",
};
const video = {
  type: "video" as const,
  exists: true,
  label: "Video",
  metadata: "57:23",
};
const worksheet = {
  type: "worksheet-pdf" as const,
  exists: true,
  label: "Worksheet",
  metadata: "PDF",
};

export const allResources = [video, worksheet, exitQuiz, starterQuiz];
export const noVideo = [worksheet, exitQuiz, starterQuiz];
export const noVideoNoExitQuiz = [
  worksheet,
  starterQuiz,
  { ...exitQuiz, exists: false },
];
