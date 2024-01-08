import { FC } from "react";

import { getSubjectIconAsset } from "../../image-data";
import Svg from "../Svg";
import { OakColorName } from "../../styles/theme/types";
import TagPromotional from "../TagPromotional";

import CMSImage, {
  CMSImageProps,
} from "@/components/SharedComponents/CMSImage";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";

type SubjectIconBrushBoardersProps = Omit<CMSImageProps, "image"> & {
  subjectSlug: string | null;
  isLegacyLesson?: boolean;
  color: OakColorName;
};

const SubjectIconBrushBoarders: FC<SubjectIconBrushBoardersProps> = ({
  subjectSlug,
  color,
  isLegacyLesson,
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
      {!isLegacyLesson && (
        <>
          <Flex
            $left={8}
            $top={10}
            $zIndex={"inFront"}
            $position={"absolute"}
            $display={["none", "flex"]}
          >
            <TagPromotional size={"large"} />
          </Flex>
          <Flex
            $top={4}
            $zIndex={"inFront"}
            $position={"absolute"}
            $display={["flex", "none"]}
          >
            <TagPromotional size={"small"} />
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default SubjectIconBrushBoarders;
