import { FC } from "react";

import CMSImage from "../CMSImage";
import { CMSImageProps } from "../CMSImage/CMSImage";
import Box from "../Box";
import { getSubjectIconAsset } from "../../image-data";
import Flex from "../Flex";
import Svg from "../Svg";
import { OakColorName } from "../../styles/theme/types";
import TagPromotional from "../TagPromotional";

type SubjectIconBrushBoardersProps = Omit<CMSImageProps, "image"> & {
  subjectSlug: string;
  lessonIsNew?: boolean;
  color: OakColorName;
};

const SubjectIconBrushBoarders: FC<SubjectIconBrushBoardersProps> = ({
  subjectSlug,
  color,
  lessonIsNew,
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

  return (
    <Flex $width={"100%"} $position={"relative"}>
      <Svg
        $color={color}
        $position={"absolute"}
        name={"icon-background-square"}
      />

      <CMSImage
        $zIndex={"inFront"}
        image={{ asset }}
        {...cmsImageProps}
        format={null}
      />
      {lessonIsNew && (
        <Flex
          $left={[-8, 12]}
          $top={[4, 0]}
          $zIndex={"inFront"}
          $position={"absolute"}
        >
          <TagPromotional />
        </Flex>
      )}
    </Flex>
  );
};

export default SubjectIconBrushBoarders;
