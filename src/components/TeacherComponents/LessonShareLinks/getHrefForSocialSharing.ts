import {
  GetSharingMetadataParams,
  getSharingMetadata,
} from "./getSharingMetadata";

export const getHrefForSocialSharing = (params: GetSharingMetadataParams) => {
  const sharingMetadata = getSharingMetadata(params);
  if (params.linkConfig.medium === "copy-link") {
    return sharingMetadata.link;
  } else {
    return params.linkConfig.url(sharingMetadata);
  }
};
