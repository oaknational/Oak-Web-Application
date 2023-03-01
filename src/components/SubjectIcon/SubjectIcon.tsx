import { FC } from "react";

import CMSImage from "../CMSImage";
import { CMSImageProps } from "../CMSImage/CMSImage";
import Box from "../Box";
import { getSubjectIconAsset } from "../../image-data";

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

  return <CMSImage image={{ asset }} {...cmsImageProps} />;
};

export default SubjectIcon;
