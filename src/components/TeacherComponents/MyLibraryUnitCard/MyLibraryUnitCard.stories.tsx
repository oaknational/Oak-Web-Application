import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

const meta: Meta<typeof MyLibraryUnitCard> = {
  component: MyLibraryUnitCard,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof MyLibraryUnitCard>;

const mockProps = {
  index: 1,
  unitTitle: "Non-fiction: crime and punishment",
  yearTitle: "Year 10",
  lessons: [
    {
      lessonSlug: "reading-complex-texts-about-crime-and-punishment",
      lessonTitle:
        "Reading and comparing two texts about prisons: London (1862) and Norway (2013)",
      description:
        "I can read two texts about the same topic - prisons - and begin to compare them.",
      pupilLessonOutcome:
        "I can read two texts about the same topic - prisons - and begin to compare them.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 1,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "writing-excellent-summaries",
      lessonTitle:
        "Developing a summary of a non-fiction text by including inferences",
      description:
        "I can identify examples of inference in a summary about a non-fiction text, and use this understanding to create my own developed summary.",
      pupilLessonOutcome:
        "I can identify examples of inference in a summary about a non-fiction text, and use this understanding to create my own developed summary.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 2,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "planning-a-well-structured-response",
      lessonTitle:
        "Using credible statistics in a piece of non-fiction writing",
      description:
        "I can understand what makes a credible statistic, and use this understanding to create my own credible statistics.",
      pupilLessonOutcome:
        "I can understand what makes a credible statistic, and use this understanding to create my own credible statistics.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 3,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "diving-deeper-with-language-analysis",
      lessonTitle:
        "Summarising a non-fiction text: 'a letter to my son' (the Guardian, 2014)",
      description:
        "I can show understanding of a non-fiction text by summarising it, as well as exploring the writer’s use of direct address.",
      pupilLessonOutcome:
        "I can show understanding of a non-fiction text by summarising it, as well as exploring the writer’s use of direct address.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 4,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "comparing-writers-attitudes-and-perspectives",
      lessonTitle:
        "Comparing texts about drug misuse: ‘Confessions’ (1821) and ‘A letter to’ (2014)",
      description:
        "I can read two texts about the same topic - drug misuse - and begin to compare the perspectives of the writers who wrote them.",
      pupilLessonOutcome:
        "I can read two texts about the same topic - drug misuse - and begin to compare the perspectives of the writers who wrote them.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 5,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "planning-and-writing-comparative-responses",
      lessonTitle: "Using figurative language in non-fiction writing",
      description:
        "I can show understanding of figurative language by exploring its effects and using it in my own writing.",
      pupilLessonOutcome:
        "I can show understanding of figurative language by exploring its effects and using it in my own writing.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 6,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "writing-in-appropriate-style-tone-and-register",
      lessonTitle: "Planning an open letter using single paragraph outlines",
      description:
        "I can plan a letter using single paragraph outlines with a focus on using credible statistics, direct address and figurative language.",
      pupilLessonOutcome:
        "I can plan a letter using single paragraph outlines with a focus on using credible statistics, direct address and figurative language.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 7,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "expressing-a-strong-viewpoint",
      lessonTitle:
        "Reading an opinion article and creating rhetorical questions",
      description:
        "I can articulate a personal response to an opinion article. I can understand what makes an effective rhetorical question and use this understanding to create my own.",
      pupilLessonOutcome:
        "I can articulate a personal response to an opinion article. I can understand what makes an effective rhetorical question and use this understanding to create my own.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 8,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "developing-a-strong-viewpoint",
      lessonTitle: "Using structural features effectively in non-fiction texts",
      description:
        "I can understand how a writer uses structural features for effect and use this understanding to consider my own use of structure in my writing.",
      pupilLessonOutcome:
        "I can understand how a writer uses structural features for effect and use this understanding to consider my own use of structure in my writing.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 9,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "using-the-conventions-of-leaflets-creatively",
      lessonTitle: "Using the conventions of website content creatively",
      description:
        "I can identify the conventions a website and use them creatively in my own writing.",
      pupilLessonOutcome:
        "I can identify the conventions a website and use them creatively in my own writing.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 10,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "planning-and-writing-a-leaflet",
      lessonTitle: "Planning and writing website content",
      description: "I can successfully plan and write copy for a website.",
      pupilLessonOutcome:
        "I can successfully plan and write copy for a website.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 11,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
    {
      lessonSlug: "revising-and-editing-your-leaflet",
      lessonTitle: "Revising and editing non-fiction writing",
      description:
        "I can use effective editing strategies to revise and rewrite a response.",
      pupilLessonOutcome:
        "I can use effective editing strategies to revise and rewrite a response.",
      expired: false,
      quizCount: 2,
      videoCount: 1,
      presentationCount: 1,
      worksheetCount: 1,
      hasCopyrightMaterial: false,
      orderInUnit: 12,
      lessonCohort: "2023-2024",
      actions: [Object],
      isUnpublished: false,
      lessonReleaseDate: "2025-03-27T10:45:01.310604+00:00",
    },
  ],
  saveTime: "2025-05-15T08:49:10.199406+00:00",
  href: "/teachers/programmes/english-secondary-ks4-aqa/units/non-fiction-crime-and-punishment/lessons",
};

export const Default: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MyLibraryUnitCard {...mockProps} />
    </OakThemeProvider>
  ),
};
