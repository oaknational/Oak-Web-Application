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
    $minWidth={["spacing-80", "spacing-160"]}
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
      $maxWidth={["spacing-80", "spacing-120"]}
      $maxHeight={["spacing-80", "spacing-120"]}
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
          $left="spacing-8"
          $top="spacing-8"
          $zIndex={"in-front"}
          $position={"absolute"}
          $display={["none", "block"]}
        >
          <TagPromotional size={"large"} />
        </OakBox>
        <OakBox
          $top="spacing-4"
          $left="spacing-8"
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
