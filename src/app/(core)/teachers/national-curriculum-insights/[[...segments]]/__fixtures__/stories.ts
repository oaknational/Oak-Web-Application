import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { localNationalCurriculumInsightsFixtures } from "./nationalCurriculumInsights";

export const storyPortableText = (text: string) => [
  {
    _key: "paragraph",
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: "text", _type: "span", marks: [], text }],
  },
];

export const storyImage = {
  altText: null,
  asset: null,
  hotspot: null,
  isPresentational: true,
};

export const hubData: NationalCurriculumInsightsRouteData = {
  hub: localNationalCurriculumInsightsFixtures.hub,
  subjects: localNationalCurriculumInsightsFixtures.hub.subjects,
  subject: null,
  page: null,
  route: { kind: "hub" },
  activeTab: null,
  activeKeyStage: null,
};

const subject = localNationalCurriculumInsightsFixtures.subjects[0]!;

export const subjectData: NationalCurriculumInsightsRouteData = {
  ...hubData,
  subject,
  page: subject,
  route: { kind: "subject", subjectSlug: subject.slug },
  activeTab: "overview",
};

export const phaseData: NationalCurriculumInsightsRouteData = {
  ...subjectData,
  page: subject.tabs[0]!.page,
  route: { kind: "subjectPhase", subjectSlug: subject.slug, phase: "primary" },
  activeTab: "primary",
};

export const guidanceData: NationalCurriculumInsightsRouteData = {
  ...hubData,
  route: { kind: "guidance" },
};
