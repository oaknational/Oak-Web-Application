import { FC } from "react";

import { getSubjectIconAsset } from "@/image-data";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import { OakColorName } from "@/styles/theme/types";
import Svg from "@/components/SharedComponents/Svg";
import CMSImage, {
  CMSImageProps,
} from "@/components/SharedComponents/CMSImage";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";
import Box from "@/components/SharedComponents/Box";

type SubjectIconBrushBoardersProps = Omit<CMSImageProps, "image"> & {
  subjectSlug: string | null;
  isNew: boolean;
  color: OakColorName;
  containerMinWidth?: FlexProps["$minWidth"];
};

const SubjectIconBrushBoarders: FC<SubjectIconBrushBoardersProps> = ({
  subjectSlug,
  color,
  isNew,
  containerMinWidth = [80, 140],
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
    <Flex $minWidth={containerMinWidth} $width={"100%"} $position={"relative"}>
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
