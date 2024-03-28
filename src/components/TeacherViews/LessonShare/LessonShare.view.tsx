import Box from "@/components/SharedComponents/Box";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { Hr } from "@/components/SharedComponents/Typography";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import {
  getLessonOverviewBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getCommonPathway,
  getLessonShareBreadCrumb,
  getBreadcrumbsForSpecialistLessonPathway,
  getBreadCrumbForSpecialistShare,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { LessonPathway } from "@/components/TeacherComponents/types/lesson.types";
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
  PupilActivityResourceTypesValueType,
  ShareMediumValueType,
} from "@/browser-lib/avo/Avo";
import {
  getSchoolName,
  getSchoolOption,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import { SpecialistLessonShareData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonShare/specialistLessonShare.schema";

type LessonShareProps =
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
      };
    }
  | {
      isCanonical: false;
      lesson: SpecialistLessonShareData;
    };

const classroomActivityMap: Partial<
  Record<ResourceType, PupilActivityResourceTypesValueType>
> = {
  "intro-quiz-questions": "starter-quiz",
  "exit-quiz-questions": "exit-quiz",
  "worksheet-pdf": "worksheet",
  video: "video",
};

// Temporary - list of subjects live on pupil experience for sharing
const pupilSubjectsLive = [
  "english",
  "english-grammar",
  "english-reading-for-pleasure",
  "english-spelling",
  "french",
  "german",
  "spanish",
  "latin",
  "citizenship",
  "drama",
  "religious-education",
  "history",
  "geography",
  "maths",
  "science",
  "combined-science",
  "chemistry",
  "biology",
  "physics",
  "art",
  "computing",
  "design-technology",
  "music",
  "physical-education",
  "computing-non-gcse",
  "expressive-arts-and-design",
  "literacy",
  "personal-social-and-emotional-development",
  "understanding-the-world",
  // "rshe-pshe", // excluded for now because of special handling of is_sensitive content
];

export function LessonShare(props: LessonShareProps) {
  const { lesson } = props;
  const {
    lessonTitle,
    lessonSlug,
    shareableResources,
    isLegacy,
    expired,
    isSpecialist,
  } = lesson;

  const specialistPathway =
    isSpecialist && !props.isCanonical
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
      : null;

  const commonPathway = getCommonPathway(
    props.isCanonical ? props.lesson.pathways : [props.lesson],
  );
  const { programmeSlug, unitSlug, subjectSlug } = commonPathway;

  const { track } = useAnalytics();
  const { lessonShared } = track;

  // Temporary - integrate with the new pupil experience for select subjects only
  const shareToNewPupilExperience =
    subjectSlug !== null && pupilSubjectsLive.includes(subjectSlug);

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
      pupilActivityResourceTypes: pupilActivityResource,
      emailSupplied: isEmailSupplied,
    });
  };
  const pupilActivityResource = selectedResources?.map((r) => {
    const resource = classroomActivityMap[r];
    return resource;
  }) as PupilActivityResourceTypesValueType[];

  return (
    <Box $ph={[16, null]} $background={"grey20"}>
      <MaxWidth $pb={80} $maxWidth={[480, 840, 1280]}>
        <Box $mb={32} $mt={24}>
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
                      specialistPathway,
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
          <Hr $color={"grey60"} $mt={24} />
        </Box>

        <ResourcePageLayout
          page={"share"}
          errors={form.errors}
          handleToggleSelectAll={handleToggleSelectAll}
          selectAllChecked={selectAllChecked}
          header="Share"
          showNoResources={!hasResources || Boolean(expired)}
          showLoading={isLocalStorageLoading}
          email={emailFromLocalStorage}
          school={schoolNameFromLocalStorage}
          schoolId={schoolIdFromLocalStorage}
          setSchool={setSchool}
          showSavedDetails={shouldDisplayDetailsCompleted}
          onEditClick={handleEditDetailsCompletedClick}
          register={form.register}
          control={form.control}
          showPostAlbCopyright={!isLegacy}
          resourcesHeader="Select online activities"
          triggerForm={form.trigger}
          hideSelectAll={shareToNewPupilExperience || Boolean(expired)}
          cardGroup={
            <LessonShareCardGroup
              control={form.control}
              hasError={form.errors?.resources !== undefined}
              triggerForm={form.trigger}
              shareableResources={expired ? [] : shareableResources}
              hideCheckboxes={shareToNewPupilExperience}
              shareLink={getHrefForSocialSharing({
                lessonSlug: lessonSlug,
                selectedActivities: selectedResources,
                schoolUrn: schoolUrn,
                linkConfig: shareLinkConfig.copy,
                usePupils: shareToNewPupilExperience,
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
              usePupils={shareToNewPupilExperience}
            />
          }
        />
      </MaxWidth>
    </Box>
  );
}
