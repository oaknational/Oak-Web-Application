import { ShareLinkConfig } from "./linkConfig";

import { ResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { resolveOakHref } from "@/common-lib/urls";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

export type SharingMetadata = {
  link: string;
  urlEncodedLink: string;
  pageTitle: string;
  urlEncodedPageTitle: string;
  shareStr: string;
  urlEncodedShareStr: string;
};
const baseUrl = getBrowserConfig("clientAppBaseUrl");

const pupilsPath = (lessonSlug: string, shareVariant: string) =>
  shareVariant
    ? `${baseUrl}${resolveOakHref({
        page: "pupil-lesson-canonical-shared",
        lessonSlug,
        shareVariant,
      })}`
    : `${baseUrl}${resolveOakHref({
        page: "pupil-lesson-canonical",
        lessonSlug,
      })}?share=true`;

export type GetSharingMetadataParams = {
  lessonSlug: string;
  selectedActivities?: Array<ResourceType>;
  schoolUrn?: string;
  linkConfig: ShareLinkConfig;
  shareVariant: string;
};

export const getSharingMetadata = ({
  lessonSlug,
  shareVariant,
}: GetSharingMetadataParams): SharingMetadata => {
  const link = pupilsPath(lessonSlug, shareVariant);

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
