import { FC } from "react";
import { OakBox, OakFlex, OakIcon } from "@oaknational/oak-components";

import TagPromotional from "@/components/SharedComponents/TagPromotional";
import { OakColorName } from "@/styles/theme/types";
import Svg from "@/components/SharedComponents/Svg";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

type SubjectIconBrushBoardersProps = {
  subjectSlug: string;
  isNew: boolean;
  color: OakColorName;
};

const SubjectIconBrushBoarders: FC<SubjectIconBrushBoardersProps> = ({
  subjectSlug,
  color,
  isNew,
}) => {
  const iconName = getValidSubjectIconName(subjectSlug);

  return (
    <OakFlex
      $minWidth={["all-spacing-13", "all-spacing-17"]}
      $width={"100%"}
      $height={"100%"}
      $position={"relative"}
      $justifyContent={"center"}
      $alignItems={"center"}
    >
      <Svg
        $color={color}
        $position={"absolute"}
        name={"icon-background-square"}
      />
      <OakBox
        $width={"100%"}
        $height={"100%"}
        $maxWidth={["all-spacing-13", "all-spacing-16"]}
        $maxHeight={["all-spacing-13", "all-spacing-16"]}
      >
        <OakIcon iconName={iconName} $width={"100%"} $height={"100%"} />
      </OakBox>

      {isNew && (
        <>
          <OakBox
            $left="all-spacing-2"
            $top="all-spacing-2"
            $zIndex={"in-front"}
            $position={"absolute"}
            $display={["none", "block"]}
          >
            <TagPromotional size={"large"} />
          </OakBox>
          <OakBox
            $top="all-spacing-1"
            $left="all-spacing-2"
            $zIndex={"in-front"}
            $position={"absolute"}
            $display={["block", "none"]}
          >
            <TagPromotional size={"small"} />
          </OakBox>
        </>
      )}
    </OakFlex>
  );
};

export default SubjectIconBrushBoarders;
