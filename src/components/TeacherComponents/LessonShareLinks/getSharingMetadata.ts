import { ShareLinkConfig } from "./linkConfig";

import { ResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";

function getActivityQueryString(selectedActivities: Array<ResourceType>) {
  const classroomActivityMap: Partial<Record<ResourceType, string>> = {
    "intro-quiz-questions": "intro_quiz",
    "exit-quiz-questions": "exit_quiz",
    "worksheet-pdf": "worksheet",
  };
  const activities = selectedActivities
    .map((key) => classroomActivityMap[key] ?? key)
    .join("+");

  return `&activities=${activities}`;
}

export type SharingMetadata = {
  link: string;
  urlEncodedLink: string;
  pageTitle: string;
  urlEncodedPageTitle: string;
  shareStr: string;
  urlEncodedShareStr: string;
};

const classroomPath = (lessonSlug: string) =>
  `https://classroom.thenational.academy/lessons/${lessonSlug}`;

const pupilsPath = (lessonSlug: string) =>
  `https://thenational.academy/pupils/lessons/${lessonSlug}?share=true`;

export type GetSharingMetadataParams = {
  lessonSlug: string;
  selectedActivities?: Array<ResourceType>;
  schoolUrn?: number;
  linkConfig: ShareLinkConfig;
  usePupils: boolean;
};

export const getSharingMetadata = ({
  lessonSlug,
  linkConfig,
  selectedActivities,
  schoolUrn,
  usePupils,
}: GetSharingMetadataParams): SharingMetadata => {
  // Encode which activities the teacher wishes to share.
  const activityQueryString = selectedActivities?.length
    ? getActivityQueryString(selectedActivities)
    : "";

  let link = usePupils ? pupilsPath(lessonSlug) : classroomPath(lessonSlug);

  if (link.endsWith("#")) {
    link = link.slice(0, -1);
  }
  link = `${link}?utm_campaign=sharing-button${activityQueryString}`;

  if (linkConfig.network) {
    link = link + `&utm_source=${linkConfig.network}`;
  }

  if (linkConfig.medium) {
    link = link + `&utm_medium=${linkConfig.medium}`;
  }

  if (schoolUrn) {
    link = link + `&schoolUrn=${schoolUrn}`;
  }

  const urlEncodedLink = encodeURIComponent(link);
  const pageTitle =
    typeof window === "undefined" ? "Oak National Academy" : document.title;
  const urlEncodedPageTitle = encodeURIComponent(pageTitle);
  const shareStr = `${pageTitle} - ${link}`;
  const urlEncodedShareStr = encodeURIComponent(shareStr);

  return {
    link,
    urlEncodedLink,
    pageTitle,
    urlEncodedPageTitle,
    shareStr,
    urlEncodedShareStr,
  };
};
