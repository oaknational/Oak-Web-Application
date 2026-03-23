import { FC } from "react";
import { OakBox } from "@oaknational/oak-components";

import { getIllustrationAsset, IllustrationSlug } from "@/image-data";
import CMSImage, {
  CMSImageProps,
} from "@/components/SharedComponents/CMSImage";

type IllustrationProps = Omit<CMSImageProps, "image" | "as"> & {
  slug: IllustrationSlug;
};

const Illustration: FC<IllustrationProps> = ({ slug, ...cmsImageProps }) => {
  const asset = getIllustrationAsset(slug);

  if (!asset) {
    return <OakBox {...cmsImageProps} />;
  }

  return <CMSImage image={{ asset }} {...cmsImageProps} />;
};

export default Illustration;
