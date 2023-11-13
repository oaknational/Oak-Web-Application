import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import {
  getSchoolOption,
  getSchoolUrn,
} from "../helpers/getFormattedDetailsForTracking";
import {
  ResourceFormProps,
  ResourceType,
  preselectedShareType,
  schema,
} from "../downloadsAndShare.types";
import { getPreselectedShareResourceTypes } from "../helpers/getDownloadResourceType";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

import {
  LessonDownloadsData,
  LessonShareData,
} from "@/node-lib/curriculum-api";

export const useResourceFormState = ({
  resources,
}: {
  resources:
    | LessonShareData["shareableResources"]
    | LessonDownloadsData["downloads"];
}) => {
  const {
    register,
    formState,
    control,
    setValue,
    trigger,
    watch,
    handleSubmit,
  } = useForm<ResourceFormProps>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const [preselectAll, setPreselectAll] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isLocalStorageLoading, setIsLocalStorageLoading] = useState(true);
  const [schoolUrn, setSchoolUrn] = useState(0);

  const getInitialResourcesState = useCallback(() => {
    return resources
      .filter((resource) => resource.exists)
      .map((resource) => resource.type);
  }, [resources]);

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
  };

  const router = useRouter();

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
        ? setValue("resources", getInitialResourcesState())
        : setValue("resources", preselected);
    }
  }, [getInitialResourcesState, router.query.preselected, setValue]);

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
    localStorageDetails,
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
