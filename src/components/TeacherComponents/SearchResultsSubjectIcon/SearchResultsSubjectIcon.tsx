import { FC } from "react";
import { OakFlex, OakIcon } from "@oaknational/oak-components";

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
    <OakFlex
      $borderRadius={"border-radius-circle"}
      $width={"spacing-56"}
      $height={"spacing-56"}
      $background="bg-decorative4-main"
      $alignItems={"center"}
      $justifyContent={"center"}
    >
      <OakIcon
        iconName={getValidSubjectIconName(subjectSlug)}
        $height="spacing-40"
        $width="spacing-40"
        alt=""
      />
    </OakFlex>
  ) : (
    <OakFlex
      $alignItems={"center"}
      $justifyContent={"center"}
      $borderRadius="border-radius-s"
      $background={"bg-decorative3-subdued"}
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
