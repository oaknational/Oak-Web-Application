import { FC } from "react";
import {
  OakSpan,
  OakFlex,
  OakSecondaryLink,
} from "@oaknational/oak-components";

import TagPromotional from "@/components/SharedComponents/TagPromotional";
import SubjectListingTextTile from "@/components/TeacherComponents/SubjectListingTextTile";
import { SubjectListingCardProps } from "@/components/TeacherComponents/SubjectListingCard";
import { KeyStageSubjectData } from "@/node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  ProgrammeListingLinkProps,
  resolveOakHref,
  UnitListingLinkProps,
} from "@/common-lib/urls";

export type SubjectListingCardCountCardProps = KeyStageSubjectData &
  Pick<SubjectListingCardProps, "keyStageSlug" | "keyStageTitle"> & {
    isLegacyLesson?: boolean;
  };

const SubjectListingCardCountCard: FC<SubjectListingCardCountCardProps> = ({
  keyStageSlug,
  programmeSlug,
  programmeCount,
  subjectSlug,
  subjectTitle,
  lessonCount,
  unitCount,
  isLegacyLesson,
}) => {
  const { track } = useAnalytics();
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
      $background={"bg-primary"}
      $flexDirection={"column"}
      $position={"relative"}
      $borderRadius={"border-radius-s"}
      $flexGrow={1}
      $flexShrink={1}
      $flexBasis={0}
    >
      {!isLegacyLesson && (
        <TagPromotional
          $right={2}
          $top={16}
          $position={"absolute"}
          size={"small"}
        />
      )}
      <OakSecondaryLink
        href={resolveOakHref(oakLinkProps)}
        aria-label={ariaLabel}
        onClick={() => {
          track.browseRefined({
            platform: "owa",
            product: "teacher lesson resources",
            engagementIntent: "refine",
            componentType: "subject_card",
            eventVersion: "2.0.0",
            analyticsUseCase: "Teacher",
            filterType: "Subject filter",
            filterValue: subjectSlug,
            activeFilters: { keyStage: [keyStageSlug] },
            googleLoginHint: null,
            clientEnvironment: null,
          });
        }}
      >
        <OakFlex $flexDirection={"column"} $pa="spacing-16">
          <OakFlex>
            <OakSpan>
              {`${unitCount} ${unitCount > 1 ? "units" : "unit"}`}{" "}
            </OakSpan>
          </OakFlex>
          <OakSpan>{`${lessonCount} ${
            lessonCount > 1 ? "lessons" : "lesson"
          }`}</OakSpan>
        </OakFlex>
      </OakSecondaryLink>
    </SubjectListingTextTile>
  );
};

export default SubjectListingCardCountCard;
