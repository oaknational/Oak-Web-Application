"use client";

import { OakBox, OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

import { useReturnToLessonProps } from "@/app/(core)/teachers/teach-with-oak/returnToLessonProps/getReturnToLessonLink";
import { extractLessonAccessedPropsFromHref } from "@/app/(core)/teachers/teach-with-oak/components/TeachWithOakHeader/extractLessonAccessedPropsFromHref";
import { DownloadSuccessHeader } from "@/app/(core)/teachers/programmes/[slug]/units/[unitSlug]/lessons/[lessonSlug]/Components/DownloadSuccessHeader/DownloadSuccessHeader";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

export type TeachWithOakDownloadSuccessViewProps = {
  curriculumPhaseOptions: SubjectPhasePickerData | null;
};

export function TeachWithOakDownloadSuccessView({
  curriculumPhaseOptions,
}: Readonly<TeachWithOakDownloadSuccessViewProps>) {
  const returnToLessonProps = useReturnToLessonProps();
  const { lessonAccessed } = useTeacherBrowseAnalytics((store) => store.track);

  const onBackClick = () => {
    if (!returnToLessonProps) {
      return;
    }
    const lessonAccessedProps =
      extractLessonAccessedPropsFromHref(returnToLessonProps);
    if (lessonAccessedProps) {
      lessonAccessed(lessonAccessedProps);
    }
  };

  return (
    <>
      <DownloadSuccessHeader
        href={returnToLessonProps?.returnTo}
        returnTo={returnToLessonProps ? "lesson" : undefined}
        onBackClick={onBackClick}
        backgroundColorLevel={1}
        showFontInstructions={false}
        heroImage={getCloudinaryImageUrl(
          "v1777386544/svg-illustrations/download-confirmation-Illustration_z1sczk.svg",
        )}
        layoutVariant="large"
      />
      {!returnToLessonProps && curriculumPhaseOptions && (
        <OakBox
          $ph={["spacing-20", "spacing-40"]}
          $pt={["spacing-48", "spacing-72"]}
          $pb={["spacing-56", "spacing-80"]}
        >
          <OakBox $maxWidth="spacing-960" $mh="auto">
            <OakFlex $flexDirection="column" $gap="spacing-40">
              <OakBox>
                <OakHeading tag="h2" $font="heading-4" $mb={"spacing-24"}>
                  Helping you deliver a world-class curriculum{" "}
                </OakHeading>
                <OakP $font="body-1">
                  Free, national curriculum-aligned resources designed by
                  subject experts, openly available to support innovation.
                </OakP>
              </OakBox>
              <OakHeading tag="h3" $font="heading-7">
                Explore curriculum plans and teaching resources
              </OakHeading>
              <OakBox $maxWidth="spacing-640">
                <SubjectPhasePicker
                  {...curriculumPhaseOptions}
                  id="teach-with-oak-download-success-subject-picker"
                />
              </OakBox>
            </OakFlex>
          </OakBox>
        </OakBox>
      )}
    </>
  );
}
