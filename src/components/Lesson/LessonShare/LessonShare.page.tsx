import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import Box from "@/components/Box";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import { Hr } from "@/components/Typography";
import {
  LessonShareData,
  LessonShareListData,
} from "@/node-lib/curriculum-api";
import useLocalStorageForDownloads from "@/components/DownloadAndShareComponents/hooks/useLocalStorageForDownloads";
import { getPreselectedShareResourceTypes } from "@/components/DownloadAndShareComponents/helpers/getDownloadResourceType";
import {
  ResourceFormProps,
  preselectedShareType,
  schema,
} from "@/components/DownloadAndShareComponents/downloadsAndShare.types";
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
import { ShareLinks } from "@/components/DownloadAndShareComponents/ShareLink/ShareLinks";

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

  const router = useRouter();

  const { register, formState, control, setValue, trigger } =
    useForm<ResourceFormProps>({
      resolver: zodResolver(schema),
      mode: "onBlur",
    });
  const [preselectAll, setPreselectAll] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    if (preselectAll) {
      setSelectAllChecked(true);
    }
  }, [preselectAll]);

  const handleToggleSelectAll = () => {
    if (selectAllChecked) {
      onDeselectAllClick();
      setSelectAllChecked(false);
    } else {
      onSelectAllClick();
      setSelectAllChecked(true);
    }
    // Trigger the form to reevaluate errors
    trigger();
  };

  const getInitialResourcesToShareState = useCallback(() => {
    return shareableResources
      .filter((resource) => resource.exists)
      .map((resource) => resource.type);
  }, [shareableResources]);

  useEffect(() => {
    const preselectedQuery = () => {
      const res = router.query.preselected;

      const result = preselectedShareType.safeParse(res);

      if (!result.success) {
        return "all";
      } else {
        return result.data;
      }
    };
    const preselected = getPreselectedShareResourceTypes(preselectedQuery());

    if (preselected) {
      setPreselectAll(preselected === "all");
      preselected === "all"
        ? setValue("resources", getInitialResourcesToShareState())
        : setValue("resources", preselected);
    }
  }, [getInitialResourcesToShareState, router.query.preselected, setValue]);

  const {
    schoolFromLocalStorage,
    emailFromLocalStorage,
    termsFromLocalStorage,
    hasDetailsFromLocalStorage,
  } = useLocalStorageForDownloads();

  const {
    schoolName: schoolNameFromLocalStorage,
    schoolId: schoolIdFromLocalStorage,
  } = schoolFromLocalStorage;

  const [isLocalStorageLoading, setIsLocalStorageLoading] = useState(true);
  useEffect(() => {
    setIsLocalStorageLoading(false);
  }, [hasDetailsFromLocalStorage]);

  // use values from local storage if available (initial value on School Picker is set within that component)
  useEffect(() => {
    if (emailFromLocalStorage) {
      setValue("email", emailFromLocalStorage);
    }

    if (termsFromLocalStorage) {
      setValue("terms", termsFromLocalStorage);
    }

    if (schoolIdFromLocalStorage) {
      setValue("school", schoolIdFromLocalStorage);
    }
  }, [
    setValue,
    emailFromLocalStorage,
    termsFromLocalStorage,
    schoolIdFromLocalStorage,
  ]);

  const [editDetailsClicked, setEditDetailsClicked] = useState(false);

  const shouldDisplayDetailsCompleted =
    !!hasDetailsFromLocalStorage && !editDetailsClicked;
  const [localStorageDetails, setLocalStorageDetails] = useState(false);

  useEffect(() => {
    if (hasDetailsFromLocalStorage || shouldDisplayDetailsCompleted) {
      setLocalStorageDetails(true);
    }
    if (editDetailsClicked) {
      setLocalStorageDetails(false);
    }
  }, [
    hasDetailsFromLocalStorage,
    localStorageDetails,
    editDetailsClicked,
    shouldDisplayDetailsCompleted,
  ]);

  const setSchool = useCallback(
    (value: string, name?: string) => {
      setValue("school", value, {
        shouldValidate: true,
      });
      setValue("schoolName", name || schoolNameFromLocalStorage, {
        shouldValidate: true,
      });
    },
    [setValue, schoolNameFromLocalStorage],
  );

  const { errors } = formState;
  const hasFormErrors = Object.keys(errors)?.length > 0;
  //   const selectedResources = (watch().resources || []) as ResourceType[]; add back in with tracking

  const [resourcesToShare, setResourcesToShare] = useState<
    LessonShareListData["type"][]
  >(getInitialResourcesToShareState());

  useEffect(() => {
    setResourcesToShare(getInitialResourcesToShareState());
  }, [getInitialResourcesToShareState, shareableResources]);

  const hasResourcesToShare = getInitialResourcesToShareState().length > 0;

  const onSelectAllClick = () => setValue("resources", resourcesToShare);
  const onDeselectAllClick = () => setValue("resources", []);

  const handleEditDetailsCompletedClick = () => {
    setEditDetailsClicked(true);
    setLocalStorageDetails(false);
  };

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
          errors={errors}
          handleToggleSelectAll={handleToggleSelectAll}
          selectAllChecked={selectAllChecked}
          header="Share"
          showNoResources={!hasResourcesToShare}
          showLoading={isLocalStorageLoading}
          email={emailFromLocalStorage}
          school={schoolNameFromLocalStorage}
          schoolId={schoolIdFromLocalStorage}
          setSchool={setSchool}
          showSavedDetails={shouldDisplayDetailsCompleted}
          onEditClick={handleEditDetailsCompletedClick}
          register={register}
          control={control}
          showPostAlbCopyright={!isLegacy}
          cardGroup={
            <ShareCardGroup
              control={control}
              hasError={errors?.resources ? true : false}
              triggerForm={trigger}
              shareableResources={shareableResources}
              shareLink={""}
            />
          }
          cta={
            <ShareLinks
              disabled={
                hasFormErrors || (!formState.isValid && !localStorageDetails)
              }
              lessonSlug={lessonSlug}
              selectedActivities={resourcesToShare}
            />
          }
        />
      </MaxWidth>
    </Box>
  );
}
