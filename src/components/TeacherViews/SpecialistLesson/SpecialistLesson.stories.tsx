import type { Meta, StoryObj } from "@storybook/react";

import Component from "./SpecialistLesson.view";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import MenuDecorator from "@/storybook-decorators/MenuDecorator";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator, MenuDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistLessonPage: Story = {
  args: {
    lesson: {
      isLegacy: true,
      pathways: [],
      lessonSlug: "a-birthday-sensory-story",
      lessonTitle: "A birthday sensory story",
      programmeSlug: "changes-and-transtions-123a",
      subjectSlug: "communication-and-language",
      developmentStageSlug: "specialist-developmental-stage",
      developmentStageTitle: "Specialist developmental stage",
      phaseSlug: "specialist-phase",
      phaseTitle: "Specialist phase",
      isCanonical: false,
      subjectTitle: "Specialist",
      unitTitle: "Creative Arts",
      unitSlug: "creative-art",
      keyLearningPoints: [
        { keyLearningPoint: "Specialist" },
        { keyLearningPoint: "Information" },
        { keyLearningPoint: "Learn" },
      ],
      additionalMaterialUrl: null,
      lessonEquipmentAndResources: null,
      supervisionLevel: null,
      contentGuidance: null,
      presentationUrl:
        "https://docs.google.com/presentation/d/18ZFU8gdczMK9U3XxmC5mN9GLN7yigCQvbSX1E0SR0WU/embed?start=false&amp;loop=false&amp",
      worksheetUrl: null,
      isWorksheetLandscape: true,
      hasCopyrightMaterial: false,
      videoMuxPlaybackId: null,
      videoWithSignLanguageMuxPlaybackId: null,
      transcriptSentences: null,
      starterQuiz: null,
      exitQuiz: null,
      expired: false,
      downloads: [],
      updatedAt: "2022-02-22T12:00:00Z",
      lessonGuideUrl: null,
      hasMediaClips: false,
      additionalFiles: null,
    },
  },
};
