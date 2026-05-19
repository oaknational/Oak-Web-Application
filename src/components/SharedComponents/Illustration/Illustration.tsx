import { OakBox, OakBoxProps } from "@oaknational/oak-components";
import { FC } from "react";

import { getIllustrationAsset, IllustrationSlug } from "@/image-data";
import CMSImage, {
  CMSImageProps,
} from "@/components/SharedComponents/CMSImage";
type IllustrationProps = Omit<CMSImageProps, "image"> & {
  slug: IllustrationSlug;
};

const Illustration: FC<IllustrationProps> = ({ slug, ...cmsImageProps }) => {
  const asset = getIllustrationAsset(slug);

  if (!asset) {
    return (
      <OakBox
        style={{ width: cmsImageProps.width, height: cmsImageProps.height }}
        {...(cmsImageProps as OakBoxProps)}
      />
    );
  }

  return <CMSImage image={{ asset }} {...cmsImageProps} />;
};

export default Illustration;
