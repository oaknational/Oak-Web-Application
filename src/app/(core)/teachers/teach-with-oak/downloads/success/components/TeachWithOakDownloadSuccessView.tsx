"use client";

import { OakBox, OakHeading } from "@oaknational/oak-components";

import { useReturnToLessonProps } from "../../../getReturnToLessonLink";
import { extractLessonAccessedPropsFromHref } from "../../../components/TeachWithOakHeader/extractLessonAccessedPropsFromHref";

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
          <OakBox $maxWidth="spacing-1280" $mh="auto">
            <OakHeading
              tag="h2"
              $font={["heading-5", "heading-4"]}
              $mb={["spacing-24", "spacing-32"]}
            >
              Explore curriculum plans and teaching resources
            </OakHeading>
            <SubjectPhasePicker
              {...curriculumPhaseOptions}
              id="teach-with-oak-download-success-subject-picker"
            />
          </OakBox>
        </OakBox>
      )}
    </>
  );
}
