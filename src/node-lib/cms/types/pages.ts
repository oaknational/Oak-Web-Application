import { Document, PortableTextJSON, Card, CTA, TextAndMedia } from "..";

export type PlanningPage = Document & {
  title: string;
  heading: string;
  summaryPortableText: PortableTextJSON;
  lessonElements: {
    introQuiz: Card;
    video: Card;
    slides: Card;
    worksheet: Card;
    exitQuiz: Card;
  };
  lessonElementsCTA: CTA;
  stepsHeading: string;
  steps: Card[];
  learnMoreHeading: string;
  learnMoreBlock1: TextAndMedia;
  learnMoreBlock2: TextAndMedia;
};
