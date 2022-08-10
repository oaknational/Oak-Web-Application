import {
  Document,
  PortableTextJSON,
  Card,
  CTA,
  TextAndMedia,
  SanityImage,
  Attachment,
  TextBlock,
} from "..";

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

export type AboutPage = Document & {
  title: string;
  whoWeAre: {
    sectionHeading: string;
    intro: TextAndMedia;
    timeline: {
      from: TextBlock;
      to: TextBlock;
      beyond: TextBlock;
      cta: CTA;
    };
    principles: TextBlock[];
  };
  leadership: {
    sectionHeading: string;
    introPortableText: PortableTextJSON;
  };
  board: {
    sectionHeading: string;
    introPortableText: PortableTextJSON;
    documents: Attachment[];
    governancePortableText: PortableTextJSON;
  };
  partners: {
    sectionHeading: string;
    introPortableText: PortableTextJSON;
    techPartners: Array<SanityImage & { name: string }>;
    curriculumPartners: Array<SanityImage & { name: string }>;
  };
  workWithUs: {
    sectionHeading: string;
    introPortableText: PortableTextJSON;
    cards: {
      joinTheTeam: Card;
      advisory: Card;
      curriculumPartner: Card;
      teacherResearch: Card;
    };
  };
  contactSection: {
    infoPortableText: PortableTextJSON;
  };
};
