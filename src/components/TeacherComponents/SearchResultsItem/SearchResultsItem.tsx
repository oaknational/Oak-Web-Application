import { FC, useState } from "react";
import {
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
  OakColorToken,
} from "@oaknational/oak-components";

import SearchResultsSubjectIcon from "@/components/TeacherComponents/SearchResultsSubjectIcon";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import OwaLink from "@/components/SharedComponents/OwaLink";
import SearchDropdown from "@/components/TeacherComponents/SearchDropdown";
import Icon from "@/components/SharedComponents/Icon";
import useClickableCard from "@/hooks/useClickableCard";
import {
  LessonListingLinkProps,
  LessonOverviewLinkProps,
} from "@/common-lib/urls";
import { PathwaySchemaCamel } from "@/context/Search/search.types";
import { NEW_COHORT } from "@/config/cohort";

export type SearchResultsItemProps = {
  subjectSlug: string;
  title: string;
  subjectTitle: string;
  keyStageShortCode: string;
  keyStageTitle: string;
  keyStageSlug: string;
  yearTitle?: string | null;
  description?: string;
  pupilLessonOutcome?: string;
  nullTitle?: string;
  examBoard?: string;
  cohort?: string;
  onToggleClick?: (searchHit: SearchResultsItemProps) => void;
  isToggleOpen?: boolean;
  pathways: PathwaySchemaCamel[] | [];
  onClick?: (searchHit: SearchResultsItemProps) => void;
  firstItemRef?: React.RefObject<HTMLAnchorElement> | null;
} & (
  | {
      type: "unit";
      nullTitle?: string;
      buttonLinkProps: LessonListingLinkProps;
    }
  | {
      type: "lesson";
      buttonLinkProps: LessonOverviewLinkProps;
      unitTitle: string;
    }
);

/**
 * Search result hit item on the search page
 */
const SearchResultsItem: FC<SearchResultsItemProps> = (props) => {
  const {
    description,
    pupilLessonOutcome,
    title,
    subjectTitle,
    buttonLinkProps,
    onClick,
    type,
    keyStageShortCode,
    yearTitle,
    cohort,
    subjectSlug,
    firstItemRef,
    pathways,
    onToggleClick,
  } = props;

  const { primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>(firstItemRef);
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const metadataArray = [capitalizedType, keyStageShortCode, yearTitle].filter(
    (item): item is string => item !== undefined,
  );

  const isPathwaySearchHit = pathways.length > 1;
  const searchHitDescription = description || pupilLessonOutcome || "";
  const [isToggleOpen, setToggleOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const backgroundColour: OakColorToken =
    type === "unit" ? "lavender30" : "pink30";
  return (
    <OakFlex
      $flexDirection={"column"}
      {...(!isPathwaySearchHit ? containerProps : null)}
      $pa="inner-padding-xl"
      onClick={() => {
        const toggleOpen = !isToggleOpen;
        setToggleOpen(toggleOpen);
        onToggleClick?.({ ...props, isToggleOpen: toggleOpen });
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      $background={isHovered || isToggleOpen ? backgroundColour : "white"}
      $mb="space-between-m2"
      $borderRadius="border-radius-m2"
    >
      <OakFlex $mb="space-between-s" $alignItems={"center"}>
        <SearchResultsSubjectIcon subjectSlug={subjectSlug} type={type} />
        <OakFlex $ml="space-between-xs" $flexDirection={"column"}>
          <OakFlex>
            <OakHeading $mb="space-between-sssx" tag={"h2"} $font={"heading-7"}>
              {subjectTitle}
            </OakHeading>
            {cohort === NEW_COHORT && <TagPromotional $ml={4} size="small" />}
          </OakFlex>
          <LessonMetadata
            $font={"heading-light-7"}
            $color={"grey60"}
            metadataArray={metadataArray}
          />
        </OakFlex>
      </OakFlex>
      <OakFlex $mb="space-between-m2" $flexDirection={"column"}>
        <OakHeading tag={"h2"} $font={["heading-6", "heading-5"]}>
          {title}
        </OakHeading>
        {searchHitDescription && (
          <OakP
            dangerouslySetInnerHTML={{
              __html: searchHitDescription,
            }}
            $mt="space-between-s"
            $font={"body-2"}
          />
        )}
      </OakFlex>
      <OakFlex $mb="space-between-m">
        {isPathwaySearchHit ? (
          <SearchDropdown
            {...props}
            isToggleOpen={isToggleOpen}
            isHovered={isHovered}
          />
        ) : (
          <OwaLink
            aria-label={`See ${type}: ${title}`}
            {...buttonLinkProps}
            onClick={() => {
              onClick?.(props);
            }}
            {...primaryTargetProps}
            $color={"navy"}
            $focusStyles={["underline"]}
          >
            <OakFlex $justifyContent={"center"} $alignItems={"center"}>
              <OakSpan $font={"heading-7"}>
                {type === "unit" ? "See unit" : "See lesson"}
              </OakSpan>
              <Icon $ml={4} name={"arrow-right"} />
            </OakFlex>
          </OwaLink>
        )}
      </OakFlex>
    </OakFlex>
  );
};

export default SearchResultsItem;
