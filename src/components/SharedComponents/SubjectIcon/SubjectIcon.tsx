import { OakBox, OakBoxProps } from "@oaknational/oak-components";
import { FC } from "react";

import { getSubjectIconAsset } from "@/image-data";
import CMSImage, {
  CMSImageProps,
} from "@/components/SharedComponents/CMSImage";
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
      <OakBox
        style={{ width: cmsImageProps.width, height: cmsImageProps.height }}
        {...(cmsImageProps as OakBoxProps)}
      />
    );
  }

  return <CMSImage image={{ asset }} {...cmsImageProps} format={null} />;
};

export default SubjectIcon;
