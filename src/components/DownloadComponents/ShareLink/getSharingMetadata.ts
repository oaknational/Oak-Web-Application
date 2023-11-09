import { ShareLinkConfig } from "./linkConfig";

function getActivityQueryString(
  selectedActivities: Array<string>, // TODO: use share resource type
) {
  const activities = selectedActivities
    .map((key) => key.toLowerCase().replace(" ", "_"))
    .join("+");

  return `&activities=${activities}`;
}

type SharingMetadata = {
  link: string;
  urlEncodedLink: string;
  pageTitle: string;
  urlEncodedPageTitle: string;
  shareStr: string;
  urlEncodedShareStr: string;
};

const classroomPath = (lessonSlug: string) => `/lessons/${lessonSlug}`;

type GetSharingMetadata = {
  network?: ShareLinkConfig["network"];
  lessonSlug: string;
  medium: ShareLinkConfig["medium"];
  selectedActivities?: Array<string>; // TODO: use shareing resource type
  schoolUrn?: string;
};

export const getSharingMetadata = ({
  network,
  lessonSlug,
  medium,
  selectedActivities,
  schoolUrn,
}: GetSharingMetadata): SharingMetadata => {
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
