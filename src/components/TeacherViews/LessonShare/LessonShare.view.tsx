import { OakBox, OakHandDrawnHR } from "@oaknational/oak-components";

import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import {
  getLessonOverviewBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getLessonShareBreadCrumb,
  getBreadcrumbsForSpecialistLessonPathway,
  getBreadCrumbForSpecialistShare,
  getCommonPathway,
  lessonIsSpecialist,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  LessonPathway,
  SpecialistLessonPathway,
} from "@/components/TeacherComponents/types/lesson.types";
import ResourcePageLayout from "@/components/TeacherComponents/ResourcePageLayout";
import LessonShareCardGroup from "@/components/TeacherComponents/LessonShareCardGroup";
import LessonShareLinks from "@/components/TeacherComponents/LessonShareLinks";
import { getHrefForSocialSharing } from "@/components/TeacherComponents/LessonShareLinks/getHrefForSocialSharing";
import { shareLinkConfig } from "@/components/TeacherComponents/LessonShareLinks/linkConfig";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import useResourceFormSubmit from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormSubmit";
import {
  ResourceFormProps,
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
import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import { SpecialistLessonShareData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonShare/specialistLessonShare.schema";
import { useOnboardingStatus } from "@/components/TeacherComponents/hooks/useOnboardingStatus";

export type LessonShareProps =
  | {
      isCanonical: true;
      lesson: {
        isSpecialist: false;
        expired: boolean | null;
        isLegacy: boolean;
        lessonTitle: string;
        lessonSlug: string;
        shareableResources: LessonShareData["shareableResources"];
        pathways: LessonPathway[];
        lessonReleaseDate: string | null;
      };
    }
  | {
      isCanonical: false;
      lesson: LessonPathway & {
        isSpecialist: false;
        developmentStageTitle?: string | null;
        expired: boolean | null;
        isLegacy: boolean;
        lessonTitle: string;
        lessonSlug: string;
        shareableResources: LessonShareData["shareableResources"];
        lessonReleaseDate: string | null;
      };
    }
  | {
      isCanonical: false;
      lesson: SpecialistLessonShareData;
    };

const classroomActivityMap: Partial<
  Record<ResourceType, ResourceTypesValueType>
> = {
  "intro-quiz-questions": "starter-quiz",
  "exit-quiz-questions": "exit-quiz",
  "worksheet-pdf": "worksheet",
  video: "video",
};

export function LessonShare(props: LessonShareProps) {
  const { isCanonical, lesson } = props;
  const {
    lessonTitle,
    lessonSlug,
    shareableResources,
    isLegacy,
    expired,
    isSpecialist,
    lessonReleaseDate,
  } = lesson;

  const commonPathway =
    lessonIsSpecialist(lesson) && !props.isCanonical
      ? {
          lessonSlug,
          lessonTitle,
          unitSlug: props.lesson.unitSlug,
          programmeSlug: props.lesson.programmeSlug,
          unitTitle: props.lesson.unitTitle,
          subjectTitle: props.lesson.subjectTitle,
          subjectSlug: props.lesson.subjectSlug,
          developmentStageTitle: props.lesson.developmentStageTitle,
          disabled: false,
        }
      : getCommonPathway(
          props.isCanonical ? props.lesson.pathways : [props.lesson],
        );
  const { programmeSlug, unitSlug } = commonPathway;

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
    handleToggleSelectAll,
    selectAllChecked,
    editDetailsClicked,
    setEmailInLocalStorage,
  } = useResourceFormState({
    shareResources: shareableResources,
    type: "share",
  });
  const onboardingStatus = useOnboardingStatus();

  const { onSubmit } = useResourceFormSubmit({
    type: "share",
  });
  const { onHubspotSubmit } = useHubspotSubmit();

  const onFormSubmit = async (
    data: ResourceFormProps,
    shareMedium: ShareMediumValueType,
  ): Promise<void> => {
    await onSubmit(data, props.lesson.lessonSlug);
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
        .map((r) => classroomActivityMap[r])
        .filter((r) => r !== undefined) as ResourceTypesValueType[],
      audience: "Pupil",
      lessonReleaseCohort: isLegacy ? "2020-2023" : "2023-2026",
      lessonReleaseDate: lessonReleaseDate ?? "unpublished",
    });
  };

  return (
    <OakBox $ph={["inner-padding-m", null]} $background={"grey20"}>
      <MaxWidth $pb={80} $maxWidth={[480, 840, 1280]}>
        <OakBox $mb={"space-between-m2"} $mt={"space-between-m"}>
          <Breadcrumbs
            breadcrumbs={
              !isSpecialist
                ? [
                    ...getBreadcrumbsForLessonPathway(commonPathway),
                    getLessonOverviewBreadCrumb({
                      lessonTitle,
                      lessonSlug,
                      programmeSlug,
                      unitSlug,
                      isCanonical,
                    }),
                    getLessonShareBreadCrumb({
                      lessonSlug,
                      programmeSlug,
                      unitSlug,
                      disabled: true,
                    }),
                  ]
                : [
                    ...getBreadcrumbsForSpecialistLessonPathway(
                      commonPathway as SpecialistLessonPathway,
                    ),
                    ...getBreadCrumbForSpecialistShare({
                      lessonSlug,
                      programmeSlug,
                      unitSlug,
                      disabled: true,
                    }),
                  ]
            }
          />
          <OakHandDrawnHR
            hrColor={"grey60"}
            $height={"all-spacing-1"}
            $mt={"space-between-m"}
            $mb={"space-between-m"}
          />
        </OakBox>
        <ResourcePageLayout
          page={"share"}
          errors={form.errors}
          handleToggleSelectAll={handleToggleSelectAll}
          selectAllChecked={selectAllChecked}
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
          hideSelectAll={true}
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
              shareLink={getHrefForSocialSharing({
                lessonSlug: lessonSlug,
                selectedActivities: selectedResources,
                schoolUrn: schoolUrn,
                linkConfig: shareLinkConfig.copy,
              })}
            />
          }
          cta={
            <LessonShareLinks
              disabled={
                hasFormErrors ||
                expired ||
                (!form.formState.isValid && !localStorageDetails)
              }
              lessonSlug={lessonSlug}
              selectedActivities={selectedResources}
              schoolUrn={schoolUrn}
              onSubmit={
                (shareMedium: ShareMediumValueType) =>
                  void form.handleSubmit((data) => {
                    onFormSubmit(data, shareMedium);
                  })() // https://github.com/orgs/react-hook-form/discussions/8622
              }
            />
          }
        />
      </MaxWidth>
    </OakBox>
  );
}
