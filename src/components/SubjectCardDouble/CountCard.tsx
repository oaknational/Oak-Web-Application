import { FC } from "react";

import { Span } from "../Typography";
import Flex from "../Flex";
import OakLink from "../OakLink";
import TagPromotional from "../TagPromotional";
import TextTile from "../TextTile/TextTitle";

import { SubjectCardDoubleProps } from "./SubjectCardDouble";

import { KeyStageSubjectData } from "@/node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

export type CountCardProps = KeyStageSubjectData &
  Pick<SubjectCardDoubleProps, "keyStageSlug" | "keyStageTitle"> & {
    isNew?: boolean;
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
  isNew,
}) => {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const ariaLabel = `${subjectTitle}: ${unitCount} ${
    unitCount > 1 ? "units" : "unit"
  }, ${lessonCount} ${lessonCount > 1 ? "lessons" : "lesson"} ${
    isNew ? "- new content" : ""
  }`;

  return (
    <TextTile
      $background={"white"}
      $flexDirection={"column"}
      $position={"relative"}
      $flex={1}
      $borderRadius={4}
    >
      {isNew && (
        <Flex $right={50} $top={[10, 3]} $position={"absolute"}>
          <TagPromotional size={"small"} $color="mint" />
        </Flex>
      )}
      <OakLink
        aria-name={subjectSlug}
        aria-label={ariaLabel}
        page={programmeCount > 1 ? "programme-index" : "unit-index"}
        programmeSlug={programmeSlug}
        keyStageSlug={keyStageSlug}
        subjectSlug={subjectSlug}
        viewType={isNew ? "teachers-2023" : "teachers"}
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
