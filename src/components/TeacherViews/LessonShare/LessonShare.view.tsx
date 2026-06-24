"use client";

import { type ReactNode, useState } from "react";
import {
  OakBox,
  OakHandDrawnHR,
  OakMaxWidth,
} from "@oaknational/oak-components";

import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import {
  getLessonOverviewBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getLessonShareBreadCrumb,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { LessonPathway } from "@/components/TeacherComponents/types/lesson.types";
import SharePageLayout from "@/components/TeacherComponents/SharePageLayout";
import LessonShareCardGroup from "@/components/TeacherComponents/LessonShareCardGroup";
import LessonShareLinks from "@/components/TeacherComponents/LessonShareLinks";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import useResourceFormSubmit from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormSubmit";
import {
  ResourceFormValues,
  ResourceType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  ShareMediumValueType,
  ResourceTypesValueType,
} from "@/browser-lib/avo/Avo";
import {
  getSchoolName,
  getSchoolOption,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import type { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import { useOnboardingStatus } from "@/components/TeacherComponents/hooks/useOnboardingStatus";
import { AssignToClassroomModal } from "@/components/TeacherComponents/AssignToClassroomModal/AssignToClassroomModal";
import {
  isLessonSection,
  LessonSection,
} from "@/components/PupilComponents/lessonSections";

export type LessonShareProps = {
  breadcrumbsSlot?: ReactNode;
  lesson: LessonPathway & {
    developmentStageTitle?: string | null;
    expired: boolean | null;
    isLegacy: boolean;
    lessonTitle: string;
    lessonSlug: string;
    shareableResources: LessonShareData["shareableResources"];
    lessonReleaseDate: string | null;
  };
};

const classroomActivityMap: Partial<
  Record<ResourceType, ResourceTypesValueType>
> = {
  "starter-quiz": "starter-quiz",
  "exit-quiz": "exit-quiz",
  video: "video",
};

const getSelectedLessonSections = (resources: string[]): LessonSection[] => {
  return resources.filter(isLessonSection);
};

const isClassroomActivityResource = (
  resource: string,
): resource is keyof typeof classroomActivityMap => {
  return Object.hasOwn(classroomActivityMap, resource);
};

export function LessonShare(props: LessonShareProps) {
  const { lesson } = props;
  const {
    lessonTitle,
    lessonSlug,
    programmeSlug,
    unitSlug,
    shareableResources,
    isLegacy,
    expired,
    lessonReleaseDate,
  } = lesson;

  const exitQuizNumQuestions = (() => {
    const exitQuizResource = shareableResources.find(
      (r) => r.type === "exit-quiz",
    );
    const parsed = exitQuizResource
      ? Number.parseInt(exitQuizResource.metadata ?? "", 10)
      : Number.NaN;
    return Number.isNaN(parsed) ? undefined : parsed;
  })();

  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);

  const { track } = useAnalytics();
  const { lessonShared } = track;

  const {
    form,
    hasResources,
    emailFromLocalStorage,
    schoolIdFromLocalStorage,
    schoolNameFromLocalStorage,
    isLocalStorageLoading,
    setSchool,
    shouldDisplayDetailsCompleted,
    handleEditDetailsCompletedClick,
    schoolUrn,
    selectedResources,
    hasFormErrors,
    localStorageDetails,
    editDetailsClicked,
    setEmailInLocalStorage,
  } = useResourceFormState({
    shareResources: shareableResources,
    type: "share",
  });

  const onValidateAndSubmit = (shareMedium: ShareMediumValueType) => {
    const isValid =
      !hasFormErrors &&
      !expired &&
      (form.formState.isValid || localStorageDetails);
    const resources = form.getValues("resources");

    void form.handleSubmit((data) => {
      onFormSubmit(
        {
          ...data,
          resources,
        },
        shareMedium,
      );
    })(); // https://github.com/orgs/react-hook-form/discussions/8622
    return isValid;
  };

  const selectedLessonSections = getSelectedLessonSections(selectedResources);

  const onboardingStatus = useOnboardingStatus();

  const { onSubmit } = useResourceFormSubmit();
  const { onHubspotSubmit } = useHubspotSubmit();

  const onFormSubmit = async (
    data: ResourceFormValues,
    shareMedium: ShareMediumValueType,
  ): Promise<void> => {
    await onSubmit({ data, slug: props.lesson.lessonSlug, type: "share" });
    await onHubspotSubmit(data);

    if (editDetailsClicked && !data.email) {
      setEmailInLocalStorage("");
    }

    const isEmailSupplied = data.email ? true : false;

    lessonShared({
      lessonName: lessonTitle,
      lessonSlug: lessonSlug,
      schoolUrn: schoolUrn,
      schoolName: getSchoolName(data.school, getSchoolOption(data.school)),
      schoolOption: getSchoolOption(data.school),
      shareMedium: shareMedium,
      emailSupplied: isEmailSupplied,
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "advocate",
      componentType: "share_button",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      resourceTypes: selectedResources
        .filter(isClassroomActivityResource)
        .flatMap((resource) => {
          const activity = classroomActivityMap[resource];
          return activity ? [activity] : [];
        }),
      audience: "Pupil",
      lessonReleaseCohort: isLegacy ? "2020-2023" : "2023-2026",
      lessonReleaseDate: lessonReleaseDate ?? "unpublished",
    });
  };

  return (
    <OakBox $ph={["spacing-16", null]} $background={"bg-neutral"}>
      <OakMaxWidth $maxWidth={["spacing-480", "spacing-960", "spacing-1280"]}>
        <OakBox $mb={"spacing-32"} $mt={"spacing-24"}>
          {props.breadcrumbsSlot ? (
            props.breadcrumbsSlot
          ) : (
            <Breadcrumbs
              breadcrumbs={[
                ...getBreadcrumbsForLessonPathway(lesson),
                getLessonOverviewBreadCrumb({
                  lessonTitle,
                  lessonSlug,
                  programmeSlug,
                  unitSlug,
                  isCanonical: false,
                }),
                getLessonShareBreadCrumb({
                  lessonSlug,
                  programmeSlug,
                  unitSlug,
                  disabled: true,
                }),
              ]}
            />
          )}
          <OakHandDrawnHR
            hrColor={"text-subdued"}
            $height={"spacing-4"}
            $mt={"spacing-24"}
            $mb={"spacing-24"}
          />
        </OakBox>
        <SharePageLayout
          errors={form.errors}
          validationSummaryKey={form.submitCount}
          header="Share your lesson"
          showNoResources={!hasResources || Boolean(expired)}
          showLoading={isLocalStorageLoading}
          email={emailFromLocalStorage}
          school={schoolNameFromLocalStorage}
          schoolId={schoolIdFromLocalStorage}
          setSchool={setSchool}
          showSavedDetails={shouldDisplayDetailsCompleted}
          showTermsAgreement={
            onboardingStatus === "not-onboarded" ||
            onboardingStatus === "unknown"
          }
          isLoading={onboardingStatus === "loading"}
          onEditClick={handleEditDetailsCompletedClick}
          register={form.register}
          control={form.control}
          showPostAlbCopyright={!isLegacy}
          triggerForm={form.trigger}
          withHomeschool={true}
          //updateAt hardcoded, only legacy share available currently
          updatedAt={"2022"}
          cardGroup={
            <LessonShareCardGroup
              control={form.control}
              hasError={form.errors?.resources !== undefined}
              triggerForm={form.trigger}
              shareableResources={expired ? [] : shareableResources}
              hideCheckboxes={true}
            />
          }
          cta={
            <>
              <LessonShareLinks
                disabled={
                  hasFormErrors ||
                  expired ||
                  (!form.formState.isValid && !localStorageDetails)
                }
                lessonSlug={lessonSlug}
                selectedActivities={selectedLessonSections}
                schoolUrn={schoolUrn}
                onSubmit={onValidateAndSubmit}
                onGoogleClassroomClick={() => setIsClassroomModalOpen(true)}
              />
              {programmeSlug && unitSlug && (
                <AssignToClassroomModal
                  isOpen={isClassroomModalOpen}
                  onClose={() => setIsClassroomModalOpen(false)}
                  lessonTitle={lessonTitle}
                  lessonSlug={lessonSlug}
                  programmeSlug={programmeSlug}
                  unitSlug={unitSlug}
                  exitQuizNumQuestions={exitQuizNumQuestions}
                />
              )}
            </>
          }
        />
      </OakMaxWidth>
    </OakBox>
  );
}
