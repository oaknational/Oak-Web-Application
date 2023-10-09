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
  subjectSlug: string | null;
  isNew?: boolean;
  color: OakColorName;
};

const SubjectIconBrushBoarders: FC<SubjectIconBrushBoardersProps> = ({
  subjectSlug,
  color,
  isNew,
  ...cmsImageProps
}) => {
  const asset = subjectSlug ? getSubjectIconAsset(subjectSlug) : null;

  if (!asset) {
    return (
      <Box
        style={{ width: cmsImageProps.width, height: cmsImageProps.height }}
        {...cmsImageProps}
      />
    );
  }

  return (
    <Flex $minWidth={[80, 140]} $width={"100%"} $position={"relative"}>
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
      {isNew && (
        <>
          <Flex
            $left={8}
            $top={10}
            $zIndex={"inFront"}
            $position={"absolute"}
            $display={["none", "flex"]}
          >
            <TagPromotional $color={"mint"} size={"large"} />
          </Flex>
          <Flex
            $top={4}
            $zIndex={"inFront"}
            $position={"absolute"}
            $display={["flex", "none"]}
          >
            <TagPromotional $color={"mint"} size={"small"} />
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default SubjectIconBrushBoarders;
