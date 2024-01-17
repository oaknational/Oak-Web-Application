import { FC } from "react";

import SearchResultsSubjectIcon from "@/components/TeacherComponents/SearchResultsSubjectIcon";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import OakLink from "@/components/SharedComponents/OakLink";
import SearchDropdown from "@/components/TeacherComponents/SearchDropdown";
import Icon from "@/components/SharedComponents/Icon";
import { Heading, P, Span } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";
import useClickableCard from "@/hooks/useClickableCard";
import {
  LessonListingLinkProps,
  LessonOverviewLinkProps,
} from "@/common-lib/urls";
import { PathwaySchemaCamel } from "@/context/Search/search.types";

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
  legacy?: boolean;
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
    legacy,
    subjectSlug,
    firstItemRef,
    pathways,
  } = props;

  const { primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>(firstItemRef);
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const metadataArray = [capitalizedType, keyStageShortCode, yearTitle].filter(
    (item): item is string => item !== undefined,
  );

  const isPathwaySearchHit = pathways.length > 1;
  const searchHitDescription = description || pupilLessonOutcome || "";

  return (
    <Flex
      $bb={1}
      $borderColor={"grey40"}
      $flexDirection={"column"}
      {...(!isPathwaySearchHit ? containerProps : null)}
      $mb={56}
      $maxWidth={734}
    >
      <Flex $mb={16} $alignItems={"center"}>
        <SearchResultsSubjectIcon subjectSlug={subjectSlug} type={type} />
        <Flex $ml={12} $flexDirection={"column"}>
          <Flex>
            <Heading $mb={4} tag={"h2"} $font={"heading-7"}>
              {subjectTitle}
            </Heading>
            {!legacy && <TagPromotional $ml={4} size="small" />}
          </Flex>
          <LessonMetadata
            $font={"heading-light-7"}
            $color={"grey60"}
            metadataArray={metadataArray}
          />
        </Flex>
      </Flex>
      <Flex $mb={32} $flexDirection={"column"}>
        <Heading tag={"h2"} $font={["heading-6", "heading-5"]}>
          {title}
        </Heading>
        {searchHitDescription && (
          <P
            dangerouslySetInnerHTML={{
              __html: searchHitDescription,
            }}
            $mt={16}
            $font={"body-2"}
          />
        )}
      </Flex>
      <Flex $mb={20}>
        {isPathwaySearchHit ? (
          <SearchDropdown {...props} />
        ) : (
          <OakLink
            aria-label={`${subjectTitle} ${type}: ${title}`}
            {...buttonLinkProps}
            onClick={() => {
              onClick?.(props);
            }}
            {...primaryTargetProps}
            $color={"navy"}
            $focusStyles={["underline"]}
          >
            <Flex $justifyContent={"center"} $alignItems={"center"}>
              <Span $font={"heading-7"}>
                {type === "unit" ? "See unit" : "See lesson"}
              </Span>
              <Icon $ml={4} name={"arrow-right"} />
            </Flex>
          </OakLink>
        )}
      </Flex>
    </Flex>
  );
};

export default SearchResultsItem;
