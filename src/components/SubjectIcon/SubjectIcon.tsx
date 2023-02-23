import { FC } from "react";

import CMSImage from "../CMSImage";
import subjectIcons from "../../image-data/subject-icons.json";
import { CMSImageProps } from "../CMSImage/CMSImage";
import Box from "../Box";

type AvailableSubjectIcons = typeof subjectIcons;
type SubjectIconSlug = keyof AvailableSubjectIcons;
type SubjectIconAsset = AvailableSubjectIcons[SubjectIconSlug];
const subjectIconsByString = subjectIcons as Record<
  string,
  SubjectIconAsset | undefined
>;

type SubjectIconProps = Omit<CMSImageProps, "image"> & {
  subjectSlug: string;
};

const getSubjectIconAsset = (
  maybeSlug: string
): SubjectIconAsset | undefined => {
  return subjectIconsByString[maybeSlug];
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
