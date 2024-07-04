import { ShareLinkConfig } from "./linkConfig";

import { ResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";

export type SharingMetadata = {
  link: string;
  urlEncodedLink: string;
  pageTitle: string;
  urlEncodedPageTitle: string;
  shareStr: string;
  urlEncodedShareStr: string;
};

const pupilsPath = (lessonSlug: string) =>
  `https://thenational.academy/pupils/lessons/${lessonSlug}?share=true`;

export type GetSharingMetadataParams = {
  lessonSlug: string;
  selectedActivities?: Array<ResourceType>;
  schoolUrn?: number;
  linkConfig: ShareLinkConfig;
};

export const getSharingMetadata = ({
  lessonSlug,
}: GetSharingMetadataParams): SharingMetadata => {
  const link = pupilsPath(lessonSlug);

  const urlEncodedLink = encodeURIComponent(link);
  const pageTitle =
    typeof window === "undefined" ? "Oak National Academy" : document.title;
  const shareStr = `${pageTitle} - ${link}`;
  const urlEncodedShareStr = encodeURIComponent(shareStr);
  const urlEncodedPageTitle = encodeURIComponent(pageTitle);

  return {
    link,
    urlEncodedLink,
    pageTitle,
    urlEncodedPageTitle,
    shareStr,
    urlEncodedShareStr,
  };
};
