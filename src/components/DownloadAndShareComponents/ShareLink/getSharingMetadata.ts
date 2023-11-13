import { ResourceType } from "../downloadsAndShare.types";

import { ShareLinkConfig } from "./linkConfig";

function getActivityQueryString(selectedActivities: Array<ResourceType>) {
  const activities = selectedActivities
    .map((key) => key.toLowerCase().replace(" ", "_"))
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

const classroomPath = (lessonSlug: string) => `/lessons/${lessonSlug}`;

export type GetSharingMetadataParams = {
  network?: ShareLinkConfig["network"];
  lessonSlug: string;
  medium: ShareLinkConfig["medium"];
  selectedActivities?: Array<ResourceType>;
  schoolUrn?: number;
};

export const getSharingMetadata = ({
  network,
  lessonSlug,
  medium,
  selectedActivities,
  schoolUrn,
}: GetSharingMetadataParams): SharingMetadata => {
  // Encode which activities the teacher wishes to share.
  const activityQueryString = selectedActivities?.length
    ? getActivityQueryString(selectedActivities)
    : "";

  const path = classroomPath(lessonSlug);

  let link = `https://classroom.thenational.academy${path}`;
  if (link.endsWith("#")) {
    link = link.slice(0, -1);
  }
  link = `${link}?utm_campaign=sharing-button${activityQueryString}`;

  if (network) {
    link = link + `&utm_source=${network}`;
  }

  if (medium) {
    link = link + `&utm_medium=${medium}`;
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
