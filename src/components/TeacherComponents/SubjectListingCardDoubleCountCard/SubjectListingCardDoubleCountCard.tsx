import { FC } from "react";
import { OakSpan } from "@oaknational/oak-components";

import OwaLink from "@/components/SharedComponents/OwaLink";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import SubjectListingTextTile from "@/components/TeacherComponents/SubjectListingTextTile";
import { SubjectListingCardDoubleProps } from "@/components/TeacherComponents/SubjectListingCardDouble";
import Flex from "@/components/SharedComponents/Flex";
import { KeyStageSubjectData } from "@/node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import {
  ProgrammeListingLinkProps,
  UnitListingLinkProps,
} from "@/common-lib/urls";

export type SubjectListingCardDoubleCountCardProps = KeyStageSubjectData &
  Pick<SubjectListingCardDoubleProps, "keyStageSlug" | "keyStageTitle"> & {
    isLegacyLesson?: boolean;
  };

const SubjectListingCardDoubleCountCard: FC<
  SubjectListingCardDoubleCountCardProps
> = ({
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
    <SubjectListingTextTile
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
      <OwaLink
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
            <OakSpan>
              {`${unitCount} ${unitCount > 1 ? "units" : "unit"}`}{" "}
            </OakSpan>
          </Flex>
          <OakSpan>{`${lessonCount} ${
            lessonCount > 1 ? "lessons" : "lesson"
          }`}</OakSpan>
        </Flex>
      </OwaLink>
    </SubjectListingTextTile>
  );
};

export default SubjectListingCardDoubleCountCard;
