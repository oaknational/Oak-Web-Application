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
        $height="spacing-40"
        $width="spacing-40"
        alt=""
      />
    </Circle>
  ) : (
    <OakFlex
      $alignItems={"center"}
      $justifyContent={"center"}
      $borderRadius="border-radius-s"
      $background={"lavender50"}
      $height="spacing-56"
      $width="spacing-56"
    >
      <OakIcon
        iconName={getValidSubjectIconName(subjectSlug)}
        $height="spacing-40"
        $width="spacing-40"
        alt=""
      />
    </OakFlex>
  );
};

export default SearchResultsSubjectIcon;
