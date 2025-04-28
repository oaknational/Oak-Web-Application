import React, { FC, useState } from "react";
import {
  OakHeading,
  OakP,
  OakFlex,
  OakColorToken,
  OakIcon,
} from "@oaknational/oak-components";
import styled from "styled-components";

import SearchResultsSubjectIcon from "@/components/TeacherComponents/SearchResultsSubjectIcon";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import SearchDropdown from "@/components/TeacherComponents/SearchDropdown";
import {
  LessonListingLinkProps,
  LessonOverviewLinkProps,
  resolveOakHref,
} from "@/common-lib/urls";
import { PathwaySchemaCamel } from "@/context/Search/search.types";
import { NEW_COHORT } from "@/config/cohort";
import useMediaQuery from "@/hooks/useMediaQuery";

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
  legacy: boolean | undefined;
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

// TODO: extract to components lib
const StyledFlexWithFocusState = styled(OakFlex)`
  &:focus-visible {
    outline: none;
    border: solid 4px #ffe555;
    box-shadow: 0px 0px 0px 5px #575757;
    border-radius: 4px;
  }
`;

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
    pathways,
    onToggleClick,
  } = props;

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

  type ButtonProps = {
    as: "button";
    onClick: () => void;
    children: React.ReactNode;
  };

  type LinkProps = {
    as: "a";
    href: string;
    onClick: () => void;
    children: React.ReactNode;
  };

  const ClickableSearchCard = (props: ButtonProps | LinkProps) => {
    const isDesktop = useMediaQuery("desktop");
    return (
      <StyledFlexWithFocusState
        {...props}
        $pa="inner-padding-xl"
        $mb="space-between-m2"
        $borderRadius="border-radius-m2"
        $flexDirection="column"
        onMouseEnter={() => isDesktop && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        $background={isHovered || isToggleOpen ? backgroundColour : "white"}
        $width="100%"
        $ba="border-solid-none"
        $color="black"
      >
        {props.children}
      </StyledFlexWithFocusState>
    );
  };

  const CardContent = () => {
    return (
      <>
        <OakFlex $mb="space-between-s" $alignItems={"center"}>
          <SearchResultsSubjectIcon subjectSlug={subjectSlug} type={type} />
          <OakFlex $ml="space-between-xs" $flexDirection="column">
            <OakFlex>
              <OakHeading
                $mb="space-between-sssx"
                tag={"h2"}
                $font={"heading-7"}
              >
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
        <OakFlex
          $mb="space-between-m2"
          $flexDirection="column"
          $alignItems="baseline"
        >
          <OakHeading
            tag={"h2"}
            $font={["heading-6", "heading-5"]}
            $textAlign="left"
          >
            {title}
          </OakHeading>
          {searchHitDescription && (
            <OakP
              dangerouslySetInnerHTML={{
                __html: searchHitDescription,
              }}
              $mt="space-between-s"
              $font={"body-2"}
              $textAlign="left"
            />
          )}
        </OakFlex>
      </>
    );
  };

  const PathwayResultCard = () => {
    return (
      <ClickableSearchCard
        as="button"
        onClick={() => {
          const toggleOpen = !isToggleOpen;
          setToggleOpen(toggleOpen);
          onToggleClick?.({ ...props, isToggleOpen: toggleOpen });
        }}
      >
        <CardContent />
        <SearchDropdown
          {...props}
          isToggleOpen={isToggleOpen}
          isHovered={isHovered}
        />
      </ClickableSearchCard>
    );
  };

  const SingleResultCard = () => {
    return (
      <ClickableSearchCard
        as="a"
        href={resolveOakHref(buttonLinkProps)}
        onClick={() => onClick?.(props)}
        aria-label={`See ${type}: ${title}`}
      >
        <CardContent />
        <OakFlex $alignItems="center">
          <OakP
            $font={"heading-7"}
            $color="navy"
            $textDecoration={isHovered ? "underline" : "none"}
          >
            {type === "unit" ? "See unit" : "See lesson"}
          </OakP>

          <OakIcon
            iconName="arrow-right"
            $colorFilter="navy"
            $width="all-spacing-6"
          />
        </OakFlex>
      </ClickableSearchCard>
    );
  };

  return isPathwaySearchHit ? <PathwayResultCard /> : <SingleResultCard />;
};

export default SearchResultsItem;
