import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import Flex from "@/components/Flex";
import Box from "@/components/Box";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import { Hr } from "@/components/Typography";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { type LessonDownloadsData } from "@/node-lib/curriculum-api";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import getFormattedDetailsForTracking from "@/components/DownloadComponents/helpers/getFormattedDetailsForTracking";
import useDownloadExistenceCheck from "@/components/DownloadComponents/hooks/useDownloadExistenceCheck";
import useLocalStorageForDownloads from "@/components/DownloadComponents/hooks/useLocalStorageForDownloads";
import useDownloadForm from "@/components/DownloadComponents/hooks/useDownloadForm";
import { getPreselectedDownloadResourceTypes } from "@/components/DownloadComponents/helpers/getDownloadResourceType";
import {
  ResourcesToDownloadArrayType,
  DownloadFormProps,
  DownloadResourceType,
  preselectedDownloadType,
  schema,
} from "@/components/DownloadComponents/downloads.types";
import Breadcrumbs from "@/components/Breadcrumbs";
import DownloadCardGroup from "@/components/DownloadComponents/DownloadCardGroup/DownloadCardGroup";
import FieldError from "@/components/FormFields/FieldError";
import debouncedSubmit from "@/components/DownloadComponents/helpers/downloadDebounceSubmit";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import {
  getLessonOverviewBreadCrumb,
  getLessonDownloadsBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getCommonPathway,
} from "@/components/Lesson/lesson.helpers";
import { LessonPathway } from "@/components/Lesson/lesson.types";
import ResourcePageLayout from "@/components/DownloadComponents/ResourcePageLayout";
import LoadingButton from "@/components/Button/LoadingButton";
import DownloadConfirmation from "@/components/DownloadComponents/DownloadConfirmation";

type LessonDownloadsProps =
  | {
      isCanonical: true;
      lesson: {
        isLegacy: boolean;
        lessonTitle: string;
        lessonSlug: string;
        downloads: LessonDownloadsData["downloads"];
        pathways: LessonPathway[];
      };
    }
  | {
      isCanonical: false;
      lesson: LessonPathway & {
        isLegacy: boolean;
        lessonTitle: string;
        lessonSlug: string;
        downloads: LessonDownloadsData["downloads"];
      };
    };

export function LessonDownloads(props: LessonDownloadsProps) {
  const { lesson } = props;
  const { lessonTitle, lessonSlug, downloads, isLegacy } = lesson;
  const commonPathway = getCommonPathway(
    props.isCanonical ? props.lesson.pathways : [props.lesson],
  );
  const {
    programmeSlug,
    keyStageTitle,
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    unitSlug,
    unitTitle,
  } = commonPathway;

  const router = useRouter();
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const isLegacyDownload = isLegacy;

  const {
    register,
    formState,
    control,
    watch,
    setValue,
    handleSubmit,
    trigger,
  } = useForm<DownloadFormProps>({
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

  const getInitialResourcesToDownloadState = useCallback(() => {
    return downloads
      .filter((download) => download.exists && !download.forbidden)
      .map((download) => download.type);
  }, [downloads]);

  useEffect(() => {
    const preselectedQuery = () => {
      const res = router.query.preselected;
      const result = preselectedDownloadType.safeParse(res);
      if (!result.success) {
        return "all";
      } else {
        return result.data;
      }
    };
    const preselected = getPreselectedDownloadResourceTypes(preselectedQuery());

    if (preselected) {
      setPreselectAll(preselected === "all");
      preselected === "all"
        ? setValue("downloads", getInitialResourcesToDownloadState())
        : setValue("downloads", preselected);
    }
  }, [getInitialResourcesToDownloadState, router.query.preselected, setValue]);

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
  const selectedResources = (watch().downloads || []) as DownloadResourceType[];

  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);

  const [resourcesToDownload, setResourcesToDownload] =
    useState<ResourcesToDownloadArrayType>(
      getInitialResourcesToDownloadState(),
    );

  const hasResourcesToDownload =
    getInitialResourcesToDownloadState().length > 0;

  const [apiError, setApiError] = useState<string | null>(null);

  const onSelectAllClick = () => setValue("downloads", resourcesToDownload);
  const onDeselectAllClick = () => setValue("downloads", []);

  const { onSubmit } = useDownloadForm({ isLegacyDownload: isLegacyDownload });

  const [isDownloadSuccessful, setIsDownloadSuccessful] =
    useState<boolean>(false);

  const onFormSubmit = async (data: DownloadFormProps): Promise<void> => {
    setApiError(null);
    try {
      await debouncedSubmit({
        data,
        lessonSlug,
        setIsAttemptingDownload,
        setEditDetailsClicked,
        onSubmit,
      });
      setIsDownloadSuccessful(true);
      const {
        schoolOption,
        schoolName,
        schoolUrn,
        selectedResourcesForTracking,
      } = getFormattedDetailsForTracking({
        school: data.school,
        selectedResources,
      });

      track.lessonResourcesDownloaded({
        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
        keyStageSlug,
        unitName: unitTitle,
        unitSlug,
        subjectTitle,
        subjectSlug,
        lessonName: lessonTitle,
        lessonSlug,
        resourceType: selectedResourcesForTracking,
        analyticsUseCase,
        schoolUrn,
        schoolName,
        schoolOption,
        emailSupplied: data?.email ? true : false,
      });
    } catch (error) {
      setIsAttemptingDownload(false);
      setIsDownloadSuccessful(false);
      setApiError(
        "There was an error downloading your files. Please try again.",
      );
    }
  };

  useDownloadExistenceCheck({
    lessonSlug,
    resourcesToCheck: resourcesToDownload,
    onComplete: setResourcesToDownload,
    isLegacyDownload: isLegacy,
  });

  const handleEditDetailsCompletedClick = () => {
    setEditDetailsClicked(true);
    setLocalStorageDetails(false);
  };

  return (
    <Box $ph={[16, null]} $background={"oakGrey1"}>
      <MaxWidth $pb={80} $maxWidth={[480, 840, 1280]}>
        <Box $mb={isDownloadSuccessful ? 0 : 32} $mt={24}>
          <Breadcrumbs
            breadcrumbs={[
              ...getBreadcrumbsForLessonPathway(commonPathway),
              getLessonOverviewBreadCrumb({
                lessonTitle,
                lessonSlug,
                programmeSlug,
                unitSlug,
              }),
              getLessonDownloadsBreadCrumb({
                lessonSlug,
                programmeSlug,
                unitSlug,
                disabled: true,
              }),
            ]}
          />
          <Hr $color={"oakGrey40"} $mt={24} />
        </Box>

        <Box $display={isDownloadSuccessful ? "block" : "none"}>
          <DownloadConfirmation
            unitSlug={unitSlug}
            lessonSlug={lessonSlug}
            programmeSlug={programmeSlug}
            data-testid="downloads-confirmation"
          />
        </Box>
        {!isDownloadSuccessful && (
          <>
            <ResourcePageLayout
              errors={errors}
              handleToggleSelectAll={handleToggleSelectAll}
              selectAllChecked={selectAllChecked}
              header="Download"
              showNoResources={!hasResourcesToDownload}
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
                <DownloadCardGroup
                  control={control}
                  downloads={downloads}
                  hasError={errors?.downloads ? true : false}
                  triggerForm={trigger}
                />
              }
              cta={
                <LoadingButton
                  onClick={
                    (event) => void handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
                  }
                  text={"Download .zip"}
                  icon={"download"}
                  isLoading={isAttemptingDownload}
                  disabled={
                    hasFormErrors ||
                    (!formState.isValid && !localStorageDetails)
                  }
                  loadingText={"Downloading..."}
                />
              }
            />

            <Flex
              $flexDirection={["column", "row"]}
              $justifyContent={"right"}
              $alignItems={"center"}
            >
              {apiError && !hasFormErrors && (
                <Box $mr={24} $textAlign={"left"}>
                  <FieldError
                    id="download-error"
                    data-testid="download-error"
                    variant={"large"}
                    withoutMarginBottom
                  >
                    {apiError}
                  </FieldError>
                </Box>
              )}
            </Flex>
          </>
        )}
      </MaxWidth>
    </Box>
  );
}
