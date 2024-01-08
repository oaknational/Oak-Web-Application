import { FC } from "react";

import OakLink from "../OakLink";
import TagPromotional from "../TagPromotional";
import TextTile from "../TextTile/TextTitle";

import { SubjectCardDoubleProps } from "./SubjectCardDouble";

import { Span } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";
import { KeyStageSubjectData } from "@/node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import {
  ProgrammeListingLinkProps,
  UnitListingLinkProps,
} from "@/common-lib/urls";

export type CountCardProps = KeyStageSubjectData &
  Pick<SubjectCardDoubleProps, "keyStageSlug" | "keyStageTitle"> & {
    isLegacyLesson?: boolean;
  };

const CountCard: FC<CountCardProps> = ({
  keyStageSlug,
  keyStageTitle,
  programmeSlug,
  programmeCount,
  subjectSlug,
  subjectTitle,
  lessonCount,
  unitCount,
  isLegacyLesson,
}) => {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const ariaLabel = `${subjectTitle}: ${unitCount} ${
    unitCount > 1 ? "units" : "unit"
  }, ${lessonCount} ${lessonCount > 1 ? "lessons" : "lesson"} ${
    !isLegacyLesson ? "- new content" : ""
  }`;

  const oakLinkProps: ProgrammeListingLinkProps | UnitListingLinkProps =
    programmeCount > 1
      ? // If there are multiple programmes, link to the programme listing page
        {
          page: "programme-index",
          subjectSlug,
          keyStageSlug,
        }
      : // If there is only one programme, link to the unit listing page for that programme
        {
          page: "unit-index",
          programmeSlug,
        };

  return (
    <TextTile
      $background={"white"}
      $flexDirection={"column"}
      $position={"relative"}
      $flex={1}
      $borderRadius={4}
    >
      {!isLegacyLesson && (
        <TagPromotional
          $right={2}
          $top={16}
          $position={"absolute"}
          size={"small"}
        />
      )}
      <OakLink
        {...oakLinkProps}
        aria-label={ariaLabel}
        $hideDefaultFocus
        onClick={() => {
          track.subjectSelected({
            keyStageTitle: keyStageTitle as KeyStageTitleValueType,
            keyStageSlug,
            subjectTitle: subjectTitle,
            subjectSlug: subjectSlug,
            analyticsUseCase,
          });
        }}
      >
        <Flex $flexDirection={"column"} $pa={16}>
          <Flex>
            <Span>{`${unitCount} ${unitCount > 1 ? "units" : "unit"}`} </Span>
          </Flex>
          <Span>{`${lessonCount} ${
            lessonCount > 1 ? "lessons" : "lesson"
          }`}</Span>
        </Flex>
      </OakLink>
    </TextTile>
  );
};

export default CountCard;
