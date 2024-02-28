import { FC } from "react";
import { OakFlex } from "@oaknational/oak-components";

import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
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
  return type === "lesson" ? (
    <Circle $background={"pink"} size={56}>
      <SubjectIcon $height={40} $width={40} subjectSlug={subjectSlug} />
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
      <SubjectIcon $height={40} $width={40} subjectSlug={subjectSlug} />
    </OakFlex>
  );
};

export default SearchResultsSubjectIcon;
