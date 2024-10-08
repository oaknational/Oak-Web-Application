import { FC } from "react";
import { OakFlex, OakIcon, isValidIconName } from "@oaknational/oak-components";

import Circle from "@/components/SharedComponents/Circle";

export type SearchResultsSubjectIconProps = {
  type: "unit" | "lesson";
  subjectSlug: string;
};

/**
 * Search results subject icon
 */
const SearchResultsSubjectIcon: FC<SearchResultsSubjectIconProps> = (props) => {
  const { type, subjectSlug } = props;
  const subjectIconName = `subject-${subjectSlug}`;
  return type === "lesson" ? (
    <Circle $background={"pink"} size={56}>
      <OakIcon
        iconName={isValidIconName(subjectIconName) ? subjectIconName : "error"}
        $height="all-spacing-8"
        $width="all-spacing-8"
      />
    </Circle>
  ) : (
    <OakFlex
      $alignItems={"center"}
      $justifyContent={"center"}
      $borderRadius="border-radius-s"
      $background={"lavender50"}
      $height="all-spacing-10"
      $width="all-spacing-10"
    >
      <OakIcon
        iconName={isValidIconName(subjectIconName) ? subjectIconName : "error"}
        $height="all-spacing-8"
        $width="all-spacing-8"
      />{" "}
    </OakFlex>
  );
};

export default SearchResultsSubjectIcon;
