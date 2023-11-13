import Box from "@/components/Box";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import { Hr } from "@/components/Typography";
import { LessonShareData } from "@/node-lib/curriculum-api";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  getLessonOverviewBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getCommonPathway,
  getLessonShareBreadCrumb,
} from "@/components/Lesson/lesson.helpers";
import { LessonPathway } from "@/components/Lesson/lesson.types";
import ResourcePageLayout from "@/components/DownloadAndShareComponents/ResourcePageLayout";
import ShareCardGroup from "@/components/DownloadAndShareComponents/ShareCardGroup/ShareCardGroup";
import ShareLinks from "@/components/DownloadAndShareComponents/ShareLink/ShareLinks";
import { getHrefForSocialSharing } from "@/components/DownloadAndShareComponents/ShareLink/getHrefForSocialSharing";
import { shareLinkConfig } from "@/components/DownloadAndShareComponents/ShareLink/linkConfig";
import { useResourceFormState } from "@/components/DownloadAndShareComponents/hooks/useResourceFormState";

type LessonShareProps =
  | {
      isCanonical: true;
      lesson: {
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
        isLegacy: boolean;
        lessonTitle: string;
        lessonSlug: string;
        shareableResources: LessonShareData["shareableResources"];
      };
    };

export function LessonShare(props: LessonShareProps) {
  const { lesson } = props;
  const { lessonTitle, lessonSlug, shareableResources, isLegacy } = lesson;
  const commonPathway = getCommonPathway(
    props.isCanonical ? props.lesson.pathways : [props.lesson],
  );
  const { programmeSlug, unitSlug } = commonPathway;

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
  } = useResourceFormState({ resources: shareableResources });

  return (
    <Box $ph={[16, null]} $background={"oakGrey1"}>
      <MaxWidth $pb={80} $maxWidth={[480, 840, 1280]}>
        <Box $mb={32} $mt={24}>
          <Breadcrumbs
            breadcrumbs={[
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
            ]}
          />
          <Hr $color={"oakGrey40"} $mt={24} />
        </Box>

        <ResourcePageLayout
          page={"share"}
          errors={form.errors}
          handleToggleSelectAll={handleToggleSelectAll}
          selectAllChecked={selectAllChecked}
          header="Share"
          showNoResources={!hasResources}
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
          cardGroup={
            <ShareCardGroup
              control={form.control}
              hasError={form.errors?.resources !== undefined}
              triggerForm={form.trigger}
              shareableResources={shareableResources}
              shareLink={getHrefForSocialSharing({
                lessonSlug: lessonSlug,
                selectedActivities: selectedResources,
                schoolUrn: schoolUrn,
                linkConfig: shareLinkConfig.copy,
              })}
            />
          }
          cta={
            <ShareLinks
              disabled={
                hasFormErrors ||
                (!form.formState.isValid && !localStorageDetails)
              }
              lessonSlug={lessonSlug}
              selectedActivities={selectedResources}
              schoolUrn={schoolUrn}
            />
          }
        />
      </MaxWidth>
    </Box>
  );
}
