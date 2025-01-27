import { FC } from "react";
import { OakSpan, OakFlex, OakBox } from "@oaknational/oak-components";

import OwaLink from "@/components/SharedComponents/OwaLink";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import SubjectListingTextTile from "@/components/TeacherComponents/SubjectListingTextTile";
import { SubjectListingCardProps } from "@/components/TeacherComponents/SubjectListingCard";
import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  ProgrammeListingLinkProps,
  UnitListingLinkProps,
} from "@/common-lib/urls";
import { Subjects } from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";

export type SubjectListingCardCountCardWithPathwaysProps = Pick<
  SubjectListingCardProps,
  "keyStageSlug" | "keyStageTitle"
> & {
  subjectPathwaysArray: Subjects;
};

const SubjectListingCardCountCardWithPathways: FC<
  SubjectListingCardCountCardWithPathwaysProps
> = ({ keyStageSlug, subjectPathwaysArray }) => {
  const { track } = useAnalytics();
  return (
    <OakFlex $flexGrow={1} $gap={"all-spacing-3"}>
      {subjectPathwaysArray.map((subjectPathway) => {
        const isLegacyLesson = !subjectPathway.hasNewContent;

        const {
          subjectSlug,
          subjectTitle,
          programmeCount,
          programmeSlug,
          lessonCount,
          unitCount,
          pathwaySlug,
          pathwayTitle,
        } = subjectPathway.data;

        const ariaLabel = `${subjectTitle} ${pathwayTitle}: ${unitCount} ${
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
            key={pathwaySlug}
          >
            <OwaLink
              {...oakLinkProps}
              aria-label={ariaLabel}
              $hideDefaultFocus
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
                });
              }}
            >
              <OakBox $borderRadius={"border-radius-s"} $overflow={"hidden"}>
                <OakFlex
                  $background={"bg-decorative3-very-subdued"}
                  $ph={"inner-padding-m"}
                  $height={"all-spacing-7"}
                  $font={"body-3-bold"}
                  $alignItems={"center"}
                >
                  {pathwayTitle}
                </OakFlex>
                <OakFlex
                  $flexDirection={"column"}
                  $pa="inner-padding-m"
                  $position={"relative"}
                >
                  {!isLegacyLesson && (
                    <TagPromotional
                      $right={2}
                      $top={16}
                      $position={"absolute"}
                      size={"small"}
                    />
                  )}
                  <OakFlex>
                    <OakSpan>
                      {`${unitCount} ${unitCount > 1 ? "units" : "unit"}`}{" "}
                    </OakSpan>
                  </OakFlex>
                  <OakSpan>{`${lessonCount} ${
                    lessonCount > 1 ? "lessons" : "lesson"
                  }`}</OakSpan>
                </OakFlex>
              </OakBox>
            </OwaLink>
          </SubjectListingTextTile>
        );
      })}
    </OakFlex>
  );
};

export default SubjectListingCardCountCardWithPathways;
