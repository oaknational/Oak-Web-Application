import { FC } from "react";
import { OakFlex, OakIcon } from "@oaknational/oak-components";

import Circle from "@/components/SharedComponents/Circle";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

export type SearchResultsSubjectIconProps = {
  type: "unit" | "lesson";
  subjectSlug: string;
};

/**
 * Search results subject icon
 */
const SearchResultsSubjectIcon: FC<SearchResultsSubjectIconProps> = (props) => {
  const { type, subjectSlug } = props;
  return type === "lesson" ? (
    <Circle $background={"pink"} size={56}>
      <OakIcon
        iconName={getValidSubjectIconName(subjectSlug)}
        $height="all-spacing-8"
        $width="all-spacing-8"
        alt=""
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
        iconName={getValidSubjectIconName(subjectSlug)}
        $height="all-spacing-8"
        $width="all-spacing-8"
        alt=""
      />
    </OakFlex>
  );
};

export default SearchResultsSubjectIcon;
