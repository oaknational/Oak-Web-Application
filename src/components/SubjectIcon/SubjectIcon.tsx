import { FC } from "react";

import { getSubjectIconAsset } from "../../image-data";

import CMSImage, {
  CMSImageProps,
} from "@/components/SharedComponents/CMSImage";
import Box from "@/components/SharedComponents/Box";

type SubjectIconProps = Omit<CMSImageProps, "image"> & {
  subjectSlug: string;
};

const SubjectIcon: FC<SubjectIconProps> = ({
  subjectSlug,
  ...cmsImageProps
}) => {
  const asset = getSubjectIconAsset(subjectSlug);

  if (!asset) {
    return (
      <Box
        style={{ width: cmsImageProps.width, height: cmsImageProps.height }}
        {...cmsImageProps}
      />
    );
  }

  return <CMSImage image={{ asset }} {...cmsImageProps} format={null} />;
};

export default SubjectIcon;
