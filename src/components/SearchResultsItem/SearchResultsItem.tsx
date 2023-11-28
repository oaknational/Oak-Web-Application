import { FC } from "react";

import LessonMetadata from "../LessonMetadata";
import Flex from "../Flex";
import { Heading, P, Span } from "../Typography";
import TagPromotional from "../TagPromotional";
import OakLink from "../OakLink";
import Icon from "../Icon";

import SearchResultsSubjectIcon from "./SearchResultsSubjectIcon";

import useClickableCard from "@/hooks/useClickableCard";
import {
  LessonListingLinkProps,
  LessonOverviewLinkProps,
} from "@/common-lib/urls";

export type SearchResultsItemProps = {
  subjectSlug: string;
  title: string;
  subjectTitle: string;
  keyStageShortCode: string;
  keyStageTitle: string;
  keyStageSlug: string;
  yearTitle?: string | null;
  description?: string;
  nullTitle?: string;
  examBoard?: string;
  legacy?: boolean;
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
    }
);

/**
 * Search result hit item on the search page
 */
const SearchResultsItem: FC<SearchResultsItemProps> = (props) => {
  const {
    description,
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
  } = props;

  const { primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>(firstItemRef);
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const metadataArray = [capitalizedType, keyStageShortCode, yearTitle].filter(
    (item): item is string => item !== undefined,
  );

  return (
    <Flex
      $bb={1}
      $borderColor={"grey40"}
      $flexDirection={"column"}
      {...containerProps}
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
        {description && (
          <P
            dangerouslySetInnerHTML={{
              __html: description,
            }}
            $mt={16}
            $font={"body-2"}
          />
        )}
      </Flex>
      <Flex $mb={20}>
        <OakLink
          aria-label={`${subjectTitle} ${type}: ${title}`}
          {...buttonLinkProps}
          onClick={() => {
            onClick?.(props);
          }}
          {...primaryTargetProps}
          $color={"navy"}
          $focusStyles={"underline"}
        >
          <Flex $justifyContent={"center"} $alignItems={"center"}>
            <Span $font={"heading-7"}>
              {type === "unit" ? "See unit" : "See lesson"}
            </Span>
            <Icon $ml={4} name={"arrow-right"} />
          </Flex>
        </OakLink>
      </Flex>
    </Flex>
  );
};

export default SearchResultsItem;
