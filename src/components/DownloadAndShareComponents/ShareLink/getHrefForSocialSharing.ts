import {
  GetSharingMetadataParams,
  getSharingMetadata,
} from "./getSharingMetadata";
import { ShareLinkConfig } from "./linkConfig";

export const getHrefForSocialSharing = (
  params: GetSharingMetadataParams,
  linkConfig: ShareLinkConfig,
) => {
  const sharingMetadata = getSharingMetadata(params);
  if (linkConfig.medium === "copy-link") {
    return sharingMetadata.link;
  } else {
    return linkConfig.url(sharingMetadata);
  }
};
