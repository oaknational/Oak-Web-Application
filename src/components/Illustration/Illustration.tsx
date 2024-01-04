import { FC } from "react";

import CMSImage from "../CMSImage";
import { CMSImageProps } from "../CMSImage/CMSImage";
import { getIllustrationAsset, IllustrationSlug } from "../../image-data";

import Box from "@/components/SharedComponents/Box";

type IllustrationProps = Omit<CMSImageProps, "image"> & {
  slug: IllustrationSlug;
};

const Illustration: FC<IllustrationProps> = ({ slug, ...cmsImageProps }) => {
  const asset = getIllustrationAsset(slug);

  if (!asset) {
    return (
      <Box
        style={{ width: cmsImageProps.width, height: cmsImageProps.height }}
        {...cmsImageProps}
      />
    );
  }

  return <CMSImage image={{ asset }} {...cmsImageProps} />;
};

export default Illustration;
