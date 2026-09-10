const exitQuiz = {
  type: "exit-quiz" as const,
  exists: true,
  label: "Exit quiz",
  metadata: "6 questions",
};
const starterQuiz = {
  type: "starter-quiz" as const,
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

export const allResources = [video, exitQuiz, starterQuiz];
export const noVideo = [exitQuiz, starterQuiz];
export const noVideoNoExitQuiz = [starterQuiz, { ...exitQuiz, exists: false }];
