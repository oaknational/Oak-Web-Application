import { FC } from "react";

import SubjectIcon from "../SubjectIcon";
import Circle from "../Circle";

import Flex from "@/components/SharedComponents/Flex";

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
    <Flex
      $alignItems={"center"}
      $justifyContent={"center"}
      $borderRadius={4}
      $background={"lavender50"}
      $height={56}
      $width={56}
    >
      <SubjectIcon $height={40} $width={40} subjectSlug={subjectSlug} />
    </Flex>
  );
};

export default SearchResultsSubjectIcon;
