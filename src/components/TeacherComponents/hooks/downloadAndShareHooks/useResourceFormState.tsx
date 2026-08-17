import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/compat/router";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSyncHubspotAndLocalStorage } from "./useSyncHubspotAndLocalStorage";

import {
  getSchoolOption,
  getSchoolUrn,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import {
  ResourceType,
  isPreselectedDownloadType,
  isPreselectedShareType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import {
  getPreselectedDownloadResourceTypes,
  getPreselectedShareResourceTypes,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadResourceType";
import {
  preselectedDownloadType,
  preselectedShareType,
  resourceFormValuesSchema,
} from "@/components/TeacherComponents/downloadAndShare.schema";
import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { DownloadType } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";

export type UseResourceFormStateProps =
  | { shareResources: LessonShareData["shareableResources"]; type: "share" }
  | {
      downloadResources: LessonDownloadsPageData["downloads"];
      additionalFilesResources: LessonDownloadsPageData["additionalFiles"];
      type: "download";
    }
  | { curriculumResources: DownloadType[]; type: "curriculum" };

const getResourcesForType = (props: UseResourceFormStateProps) => {
  switch (props.type) {
    case "share":
      return props.shareResources;
    case "download":
      return props.downloadResources;
    case "curriculum":
      return props.curriculumResources;
  }
};

const getAdditionalResourcesForType = (props: UseResourceFormStateProps) => {
  return props.type === "download" ? props.additionalFilesResources : undefined;
};

const getInitialResourceTypes = (
  type: UseResourceFormStateProps["type"],
  resources:
    | LessonShareData["shareableResources"]
    | LessonDownloadsPageData["downloads"]
    | DownloadType[],
) => {
  if (type === "share") {
    return (resources as LessonShareData["shareableResources"])
      .filter((resource) => resource.exists)
      .map((resource) => resource.type);
  }

  if (type === "download") {
    return (resources as LessonDownloadsPageData["downloads"])
      .filter((resource) => resource.exists && !resource.forbidden)
      .map((resource) => resource.type);
  }

  if (type === "curriculum") {
    return resources as DownloadType[];
  }

  throw new Error("Invalid resource type");
};

const getInitialAdditionalFileTypes = (
  type: UseResourceFormStateProps["type"],
  additionalResources: LessonDownloadsPageData["additionalFiles"] | undefined,
) => {
  if (type !== "download" || !additionalResources) {
    return undefined;
  }

  return additionalResources
    .filter(
      (additionalResource) =>
        additionalResource.exists && !additionalResource.forbidden,
    )
    .map((resource) => `${resource.type}-${resource.assetId.toString()}`);
};

export const useResourceFormState = (props: UseResourceFormStateProps) => {
  const isCurriculum = props.type === "curriculum";
  const isDownload = props.type === "download";
  const isShare = props.type === "share";
  const selectAllByDefault = isCurriculum;

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    formState,
    control,
    setValue,
    trigger,
    watch,
    getValues,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(resourceFormValuesSchema),
    mode: "onBlur",
    defaultValues: {
      resources: isCurriculum ? props.curriculumResources : [],
    },
  });

  const [selectAllChecked, setSelectAllChecked] = useState(selectAllByDefault);
  const [editDetailsClicked, setEditDetailsClicked] = useState(false);
  const [hasLocalStorageDetails, setHasLocalStorageDetails] = useState(false);

  const {
    hasDetailsFromLocalStorage,
    emailFromLocalStorage,
    schoolIdFromLocalStorage,
    schoolNameFromLocalStorage,
    schoolUrn,
    hubspotLoaded,
    isLocalStorageLoading,
    setEmailInLocalStorage,
    setSchoolInLocalStorage,
    setTermsInLocalStorage,
    setSchoolUrn,
  } = useSyncHubspotAndLocalStorage({ setValue });

  const resources = useMemo(() => getResourcesForType(props), [props]);
  const additionalResources = useMemo(
    () => getAdditionalResourcesForType(props),
    [props],
  );

  const initialResources = useMemo(
    () => getInitialResourceTypes(props.type, resources),
    [props.type, resources],
  );

  const initialAdditionalFiles = useMemo(
    () => getInitialAdditionalFileTypes(props.type, additionalResources),
    [props.type, additionalResources],
  );

  const getInitialResourcesState = useCallback(
    () => initialResources,
    [initialResources],
  );

  // Mark local storage for refresh when edit details button clicked
  useEffect(() => {
    if (hasDetailsFromLocalStorage) {
      const localStorageNeedsRefreshing = !editDetailsClicked;
      setHasLocalStorageDetails(localStorageNeedsRefreshing);
    }
  }, [hasDetailsFromLocalStorage, editDetailsClicked]);

  const setSchool = useCallback(
    (value: string, name?: string) => {
      setValue("school", value, {
        shouldValidate: true,
      });
      setValue("schoolName", name || schoolNameFromLocalStorage, {
        shouldValidate: true,
      });
      const schoolUrn = getSchoolUrn(value, getSchoolOption(value));
      setSchoolUrn(schoolUrn);
    },
    [setValue, schoolNameFromLocalStorage, setSchoolUrn],
  );

  const { errors, submitCount } = formState;
  const hasFormErrors = Object.keys(errors)?.length > 0;
  const selectedResources = watch("resources") as ResourceType[];

  const [activeResources, setActiveResources] =
    useState<string[]>(initialResources);

  const [activeAdditionalFiles, setActiveAdditionalFiles] = useState<
    string[] | undefined
  >(initialAdditionalFiles);

  const hasResources = initialResources.length > 0;

  // Keep selectAllChecked in sync by comparing selected resources to available resources
  useEffect(() => {
    if (selectedResources?.length < activeResources.length) {
      setSelectAllChecked(false);
    } else {
      setSelectAllChecked(true);
    }
  }, [selectedResources, activeResources]);

  const onSelectAllClick = () =>
    setValue("resources", activeResources.concat(activeAdditionalFiles || []));
  const onDeselectAllClick = () => setValue("resources", []);

  const handleEditDetailsCompletedClick = () => {
    setEditDetailsClicked(true);
    setHasLocalStorageDetails(false);
    setValue("email", emailFromLocalStorage);
  };

  useEffect(() => {
    if (router && !router.isReady) return;
    if (isCurriculum) return;

    const getPreselectedQuery = () => {
      const value = searchParams?.get("preselected");

      const result = isDownload
        ? preselectedDownloadType.safeParse(value)
        : preselectedShareType.safeParse(value);

      return result.success ? result.data : "all";
    };

    const getAllAvailableResources = () =>
      initialResources.concat((initialAdditionalFiles || []) as ResourceType[]);

    const getPreselectedResources = () => {
      const queryResult = getPreselectedQuery();

      if (isShare && isPreselectedShareType(queryResult)) {
        return getPreselectedShareResourceTypes(queryResult);
      }

      if (isDownload && isPreselectedDownloadType(queryResult)) {
        const downloads = additionalResources
          ? resources?.concat(additionalResources)
          : resources;

        return getPreselectedDownloadResourceTypes(
          queryResult,
          downloads as LessonDownloadsPageData["downloads"],
        );
      }

      return undefined;
    };

    const expandAdditionalFiles = (preselected: ResourceType[]) => {
      if (!preselected.includes("additional-files") || !additionalResources) {
        return preselected;
      }

      const additionalFiles = additionalResources.map(
        (resource) => `additional-files-${resource.assetId}` as ResourceType,
      );

      return preselected
        .concat(additionalFiles)
        .filter((resource) => resource !== "additional-files");
    };

    const preselected = getPreselectedResources();

    if (!preselected) return;

    if (preselected === "all") {
      setSelectAllChecked(true);
      setValue("resources", getAllAvailableResources());
      return;
    }

    setValue("resources", expandAdditionalFiles(preselected));
  }, [
    isCurriculum,
    isDownload,
    isShare,
    router,
    router?.isReady,
    searchParams,
    resources,
    additionalResources,
    initialResources,
    initialAdditionalFiles,
    setValue,
  ]);

  const handleToggleSelectAll = () => {
    if (selectAllChecked) {
      onDeselectAllClick();
    } else {
      onSelectAllClick();
    }
    // Trigger the form to reevaluate errors
    trigger();
  };

  return {
    hasResources,
    isLocalStorageLoading,
    emailFromLocalStorage,
    schoolNameFromLocalStorage,
    schoolIdFromLocalStorage,
    setSchool,
    shouldDisplayDetailsCompleted:
      !!hasDetailsFromLocalStorage && !editDetailsClicked,
    handleEditDetailsCompletedClick,
    selectedResources,
    schoolUrn,
    hasFormErrors,
    setEmailInLocalStorage,
    setSchoolInLocalStorage,
    setTermsInLocalStorage,
    localStorageDetails: hasLocalStorageDetails,
    editDetailsClicked,
    setEditDetailsClicked,
    activeResources,
    setActiveResources,
    activeAdditionalFiles,
    setActiveAdditionalFiles,
    handleToggleSelectAll,
    selectAllChecked,
    hubspotLoaded,
    form: {
      trigger,
      setValue,
      watch,
      getValues,
      formState,
      getInitialResourcesState,
      errors,
      submitCount,
      control,
      register,
      handleSubmit,
    },
  };
};
