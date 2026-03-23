import { FC } from "react";
import { OakBox } from "@oaknational/oak-components";

import { getSubjectIconAsset } from "@/image-data";
import CMSImage, {
  CMSImageProps,
} from "@/components/SharedComponents/CMSImage";

type SubjectIconProps = Omit<Omit<CMSImageProps, "as">, "image"> & {
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
        {...cmsImageProps}
      />
    );
  }

  return <CMSImage image={{ asset }} {...cmsImageProps} format={null} />;
};

export default SubjectIcon;
