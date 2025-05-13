import { FC } from "react";
import { OakFlex, OakPrimaryButton } from "@oaknational/oak-components";

import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { Unit, UnitOption } from "@/utils/curriculum/types";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { transformOwaLinkProps } from "@/components/SharedComponents/OwaLink";
import { areLessonsAvailable } from "@/utils/curriculum/lessons";

type CurricUnitModalFooterProps = {
  displayModal: boolean;
  onClose: () => void;
  programmeSlug?: string;
  unitData?: Unit | undefined;
  unitOptionData: UnitOption | undefined;
};

export const CurricUnitModalFooter: FC<CurricUnitModalFooterProps> = ({
  unitOptionData,
  programmeSlug,
  unitData,
}) => {
  const { track } = useAnalytics();

  const lessonsAvailable = areLessonsAvailable(
    unitOptionData?.lessons ?? unitData?.lessons ?? [],
  );
  const unitOptionsAvailable =
    (unitData?.unit_options ?? []).length > 0 && !unitOptionData;

  let resolvedUnitSlug: string = "";
  if (unitData) {
    if (unitOptionData) {
      const unitOption = unitData?.unit_options?.find(
        ({ slug }) => slug === unitOptionData.slug,
      );
      resolvedUnitSlug = unitOption?.slug ?? unitData.slug;
    } else {
      resolvedUnitSlug = unitData.slug;
    }
  }

  const lessonPageProps =
    lessonsAvailable && programmeSlug && resolvedUnitSlug
      ? transformOwaLinkProps({
          page: "lesson-index",
          unitSlug: resolvedUnitSlug,
          programmeSlug,
        })
      : null;

  const lessonPageHref = lessonPageProps?.nextLinkProps?.href;

  return (
    <>
      {!unitOptionsAvailable && (
        <OakFlex
          $justifyContent={"space-between"}
          $alignItems={["flex-end"]}
          $pa="inner-padding-ssx"
        >
          <OakPrimaryButton
            data-testid="unit-lessons-button"
            iconName="chevron-right"
            isTrailingIcon={true}
            disabled={!lessonsAvailable}
            element={lessonsAvailable ? "a" : "button"}
            aria-label={
              !lessonsAvailable
                ? "Coming soon See lessons in unit"
                : "See lessons in unit"
            }
            aria-disabled={!lessonsAvailable ? "true" : "false"}
            {...(lessonsAvailable && { href: lessonPageHref })}
            onClick={() => {
              if (unitData && lessonsAvailable) {
                track.curriculumVisualiserExited({
                  unitName: unitData.title,
                  unitSlug: resolvedUnitSlug,
                  subjectTitle: unitData.subject,
                  subjectSlug: unitData.subject_slug,
                  platform: "owa",
                  product: "curriculum visualiser",
                  engagementIntent: "use",
                  componentType: "curriculum_visualiser_button",
                  eventVersion: "2.0.0",
                  analyticsUseCase: "Teacher",
                  yearGroupName: `Year ${unitData?.year}`,
                  yearGroupSlug: unitData.year,
                });
              }
            }}
          >
            <OakFlex
              $flexDirection={"row"}
              $alignItems={"center"}
              $gap="all-spacing-2"
            >
              {lessonsAvailable === false && (
                <TagFunctional
                  data-testid="coming-soon-flag"
                  text={"Coming soon"}
                  color="grey"
                />
              )}
              See lessons in unit
            </OakFlex>
          </OakPrimaryButton>
        </OakFlex>
      )}
    </>
  );
};
