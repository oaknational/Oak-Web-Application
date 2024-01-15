import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

import {
  getSchoolOption,
  getSchoolUrn,
} from "@/components/TeacherComponents/downloadAndShareHelpers/getFormattedDetailsForTracking";
import {
  ResourceFormProps,
  ResourceType,
  isPreselectedDownloadType,
  isPreselectedShareType,
} from "@/components/DownloadAndShareComponents/downloadAndShare.types";
import {
  getPreselectedDownloadResourceTypes,
  getPreselectedShareResourceTypes,
} from "@/components/TeacherComponents/downloadAndShareHelpers/getDownloadResourceType";
import {
  preselectedDownloadType,
  preselectedShareType,
  resourceFormValuesSchema,
} from "@/components/DownloadAndShareComponents/downloadAndShare.schema";
import {
  LessonDownloadsData,
  LessonShareData,
} from "@/node-lib/curriculum-api";

export type UseResourceFormStateProps =
  | { shareResources: LessonShareData["shareableResources"]; type: "share" }
  | { downloadResources: LessonDownloadsData["downloads"]; type: "download" };

export const useResourceFormState = (props: UseResourceFormStateProps) => {
  const {
    register,
    formState,
    control,
    setValue,
    trigger,
    watch,
    handleSubmit,
  } = useForm<ResourceFormProps>({
    resolver: zodResolver(resourceFormValuesSchema),
    mode: "onBlur",
  });
  const [preselectAll, setPreselectAll] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isLocalStorageLoading, setIsLocalStorageLoading] = useState(true);
  const [schoolUrn, setSchoolUrn] = useState(0);

  const resources =
    props.type === "share" ? props.shareResources : props.downloadResources;

  const getInitialResourcesState = useCallback(() => {
    if (props.type === "share") {
      return (resources as LessonShareData["shareableResources"])
        .filter((resource) => resource.exists)
        .map((resource) => resource.type);
    } else {
      return (resources as LessonDownloadsData["downloads"])
        .filter((resource) => resource.exists && !resource.forbidden)
        .map((resource) => resource.type);
    }
  }, [resources, props.type]);

  const {
    schoolFromLocalStorage,
    emailFromLocalStorage,
    termsFromLocalStorage,
    hasDetailsFromLocalStorage,
    setEmailInLocalStorage,
  } = useLocalStorageForDownloads();

  const {
    schoolName: schoolNameFromLocalStorage,
    schoolId: schoolIdFromLocalStorage,
  } = schoolFromLocalStorage;

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
      const schoolUrn = getSchoolUrn(
        schoolIdFromLocalStorage,
        getSchoolOption(schoolIdFromLocalStorage),
      );
      setSchoolUrn(schoolUrn);
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
      const schoolUrn = getSchoolUrn(value, getSchoolOption(value));
      setSchoolUrn(schoolUrn);
    },
    [setValue, schoolNameFromLocalStorage],
  );

  const { errors } = formState;
  const hasFormErrors = Object.keys(errors)?.length > 0;
  const selectedResources = (watch().resources || []) as ResourceType[];

  const [activeResources, setActiveResources] = useState<ResourceType[]>(
    getInitialResourcesState(),
  );

  useEffect(() => {
    setActiveResources(getInitialResourcesState());
  }, [getInitialResourcesState, resources]);

  const hasResources = getInitialResourcesState().length > 0;

  const onSelectAllClick = () => setValue("resources", activeResources);
  const onDeselectAllClick = () => setValue("resources", []);

  const handleEditDetailsCompletedClick = () => {
    setEditDetailsClicked(true);
    setLocalStorageDetails(false);
    setValue("email", emailFromLocalStorage);
  };

  const router = useRouter();

  useEffect(() => {
    const preselectedQuery = () => {
      const res = router.query.preselected;

      const result =
        props.type === "download"
          ? preselectedDownloadType.safeParse(res)
          : preselectedShareType.safeParse(res);

      if (!result.success) {
        return "all";
      } else {
        return result.data;
      }
    };
    const queryResults = preselectedQuery();
    let preselected: "all" | ResourceType[] | undefined;

    if (isPreselectedShareType(queryResults)) {
      preselected = getPreselectedShareResourceTypes(queryResults);
    }
    if (isPreselectedDownloadType(queryResults)) {
      preselected = getPreselectedDownloadResourceTypes(queryResults);
    }

    if (preselected) {
      setPreselectAll(preselected === "all");
      preselected === "all"
        ? setValue("resources", getInitialResourcesState())
        : setValue("resources", preselected);
    }
  }, [
    getInitialResourcesState,
    props.type,
    router.query.preselected,
    setValue,
  ]);

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

  return {
    hasResources,
    isLocalStorageLoading,
    emailFromLocalStorage,
    schoolNameFromLocalStorage,
    schoolIdFromLocalStorage,
    setSchool,
    shouldDisplayDetailsCompleted,
    handleEditDetailsCompletedClick,
    selectedResources,
    schoolUrn,
    hasFormErrors,
    setEmailInLocalStorage,
    localStorageDetails,
    editDetailsClicked,
    setEditDetailsClicked,
    activeResources,
    setActiveResources,
    handleToggleSelectAll,
    selectAllChecked,
    form: {
      trigger,
      setValue,
      formState,
      getInitialResourcesState,
      errors,
      control,
      register,
      handleSubmit,
    },
  };
};
