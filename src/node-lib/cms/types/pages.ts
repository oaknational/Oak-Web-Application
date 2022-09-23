import {
  Document,
  PortableTextJSON,
  Card,
  CTA,
  TextAndMedia,
  SanityImage,
  Attachment,
  TextBlock,
  TeamMember,
  BlogPostPreview,
  Seo,
} from "..";

export type HomePage = Document & {
  heading: string;
  summaryPortableText: PortableTextJSON;
  sidebarCard1: Card;
  sidebarCard2: Card;
  sidebarForm: {
    title: string;
    bodyPortableText: PortableTextJSON;
  };
  seo?: Seo | null;
};

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
  seo?: Seo | null;
};

export type AboutPageBase = Document & {
  title: string;
  summaryPortableText: PortableTextJSON;
  contactSection: {
    infoPortableText: PortableTextJSON;
  };
  seo?: Seo | null;
};

export type AboutWhoWeArePage = AboutPageBase & {
  heading: string;
  intro: TextAndMedia;
  timeline: {
    from: TextBlock;
    to: TextBlock;
    beyond: TextBlock;
    cta: CTA;
  };
  principles: TextBlock[];
};

export type AboutLeadershipPage = AboutPageBase & {
  heading: string;
  introPortableText: PortableTextJSON;
};

export type AboutBoardPage = AboutPageBase & {
  heading: string;
  introPortableText: PortableTextJSON;
  documents: Attachment[];
  governancePortableText: PortableTextJSON;
  boardMembers: TeamMember[];
};

export type AboutPartnersPage = AboutPageBase & {
  heading: string;
  introPortableText: PortableTextJSON;
  techPartners: Array<SanityImage & { name: string }>;
  curriculumPartners: Array<SanityImage & { name: string }>;
};

export type AboutWorkWithUsPage = AboutPageBase & {
  heading: string;
  introPortableText: PortableTextJSON;
  cards: {
    joinTheTeam: Card;
    advisory: Card;
    curriculumPartner: Card;
    teacherResearch: Card;
  };
};

export type CurriculumPage = Document & {
  title: string;
  heading: string;
  summaryPortableText: PortableTextJSON;
  info: TextBlock;
  gettingStarted: TextBlock;
  elements: {
    title: string;
    posts: {
      title: string;
      post: Pick<BlogPostPreview, "title" | "slug">;
    }[];
  };
  ourApproach: TextBlock;
  seo?: Seo | null;
};
