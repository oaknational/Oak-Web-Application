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
  | { curriculumResources: DownloadType[]; type: "curriculum" }
  | {
      type: "teach-with-oak";
    };

type ResourceFormSelection = {
  initialResources: ResourceType[];
  initialAdditionalFiles?: ResourceType[];
  initialSelectedResources: ResourceType[];
};

/**
 * Share helpers
 */
const getShareFormSelection = (
  shareResources: LessonShareData["shareableResources"],
): ResourceFormSelection => {
  const initialResources = shareResources
    .filter((resource) => resource.exists)
    .map((resource) => resource.type);

  return {
    initialResources,
    initialSelectedResources: [],
  };
};

const getSharePreselectedResources = (value: string | null) => {
  const result = preselectedShareType.safeParse(value);

  return result.success && isPreselectedShareType(result.data)
    ? getPreselectedShareResourceTypes(result.data)
    : "all";
};

/**
 * Lesson download helpers
 */

const getLessonDownloadFormSelection = (
  downloadResources: LessonDownloadsPageData["downloads"],
  additionalFilesResources: LessonDownloadsPageData["additionalFiles"],
): ResourceFormSelection => {
  const initialResources = downloadResources
    .filter((resource) => resource.exists && !resource.forbidden)
    .map((resource) => resource.type);
  const initialAdditionalFiles = additionalFilesResources
    .filter((resource) => resource.exists && !resource.forbidden)
    .map(
      (resource) =>
        `${resource.type}-${resource.assetId.toString()}` as ResourceType,
    );

  return {
    initialResources,
    initialAdditionalFiles,
    initialSelectedResources: [],
  };
};

const getDownloadPreselectedResources = (
  value: string | null,
  downloadResources: LessonDownloadsPageData["downloads"],
  additionalFilesResources: LessonDownloadsPageData["additionalFiles"],
) => {
  const result = preselectedDownloadType.safeParse(value);

  if (!result.success || !isPreselectedDownloadType(result.data)) {
    return "all";
  }

  const preselected = getPreselectedDownloadResourceTypes(
    result.data,
    downloadResources.concat(
      additionalFilesResources,
    ) as LessonDownloadsPageData["downloads"],
  ) as ResourceType[] | undefined;

  if (!preselected) {
    return "all";
  }

  if (!preselected.includes("additional-files")) {
    return preselected;
  }

  return preselected
    .concat(
      additionalFilesResources.map(
        (resource) => `additional-files-${resource.assetId}` as ResourceType,
      ),
    )
    .filter((resource) => resource !== "additional-files");
};

/**
 * Curriculum helpers
 */

const getCurriculumFormSelection = (
  curriculumResources: DownloadType[],
): ResourceFormSelection => ({
  initialResources: curriculumResources,
  initialSelectedResources: curriculumResources,
});

/**
 * Teach with Oak helpers
 */

const getTeachWithOakFormSelection = (): ResourceFormSelection => ({
  initialResources: [
    "explanation",
    "feedback",
    "practice",
    "check-for-understanding",
  ],
  initialSelectedResources: [
    "explanation",
    "feedback",
    "practice",
    "check-for-understanding",
  ],
});

export const useResourceFormState = (props: UseResourceFormStateProps) => {
  const resourceType = props.type;
  const shareResources =
    props.type === "share" ? props.shareResources : undefined;
  const downloadResources =
    props.type === "download" ? props.downloadResources : undefined;
  const additionalFilesResources =
    props.type === "download" ? props.additionalFilesResources : undefined;
  const curriculumResources =
    props.type === "curriculum" ? props.curriculumResources : undefined;

  const resourceFormSelection = useMemo(() => {
    switch (resourceType) {
      case "share": {
        if (!shareResources) throw new Error("Invalid resource type");
        return getShareFormSelection(shareResources);
      }
      case "download": {
        if (!downloadResources || !additionalFilesResources) {
          throw new Error("Invalid resource type");
        }
        return getLessonDownloadFormSelection(
          downloadResources,
          additionalFilesResources,
        );
      }
      case "curriculum": {
        if (!curriculumResources) throw new Error("Invalid resource type");
        return getCurriculumFormSelection(curriculumResources);
      }
      case "teach-with-oak": {
        return getTeachWithOakFormSelection();
      }
      default:
        throw new Error("Invalid resource type");
    }
  }, [
    resourceType,
    shareResources,
    downloadResources,
    additionalFilesResources,
    curriculumResources,
  ]);
  const { initialResources, initialAdditionalFiles, initialSelectedResources } =
    resourceFormSelection;

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
      resources: initialSelectedResources,
    },
  });

  const [selectAllChecked, setSelectAllChecked] = useState(
    props.type === "curriculum" || props.type === "teach-with-oak",
  );
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
    if (resourceType === "curriculum" || resourceType === "teach-with-oak")
      return;

    const getAllAvailableResources = () =>
      initialResources.concat((initialAdditionalFiles || []) as ResourceType[]);

    const value = searchParams?.get("preselected") ?? null;
    let preselected: ResourceType[] | "all" | undefined;
    if (resourceType === "share") {
      preselected = getSharePreselectedResources(value);
    } else {
      if (!downloadResources || !additionalFilesResources) {
        throw new Error("Invalid resource type");
      }
      preselected = getDownloadPreselectedResources(
        value,
        downloadResources,
        additionalFilesResources,
      );
    }

    if (preselected === "all") {
      setSelectAllChecked(true);
      setValue("resources", getAllAvailableResources());
      return;
    }

    if (!preselected) return;

    setValue("resources", preselected);
  }, [
    resourceType,
    downloadResources,
    additionalFilesResources,
    router,
    router?.isReady,
    searchParams,
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
