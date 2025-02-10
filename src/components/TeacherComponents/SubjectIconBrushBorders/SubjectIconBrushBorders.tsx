import { FC } from "react";
import {
  OakBox,
  OakFlex,
  OakIcon,
  OakColorFilterToken,
} from "@oaknational/oak-components";

import TagPromotional from "@/components/SharedComponents/TagPromotional";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

type SubjectIconBrushBoardersProps = {
  subjectSlug: string | null;
  isNew: boolean;
  color: OakColorFilterToken;
};

const SubjectIconBrushBoarders: FC<SubjectIconBrushBoardersProps> = ({
  subjectSlug,
  color,
  isNew,
}) => (
  <OakFlex
    $minWidth={["all-spacing-13", "all-spacing-17"]}
    $width={"100%"}
    $height={"100%"}
    $position={"relative"}
    $justifyContent={"center"}
    $alignItems={"center"}
  >
    <OakIcon
      iconName={"icon-background-square"}
      $colorFilter={color}
      $position={"absolute"}
      $width={"100%"}
      $height={"100%"}
    />
    <OakBox
      $width={"100%"}
      $height={"100%"}
      $maxWidth={["all-spacing-13", "all-spacing-16"]}
      $maxHeight={["all-spacing-13", "all-spacing-16"]}
    >
      <OakIcon
        iconName={getValidSubjectIconName(subjectSlug)}
        $width={"100%"}
        $height={"100%"}
        alt=""
      />
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

export default SubjectIconBrushBoarders;
