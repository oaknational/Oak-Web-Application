import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/compat/router";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

import { fetchHubspotContactDetails } from "../../helpers/downloadAndShareHelpers/fetchHubspotContactDetails";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

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

export const useResourceFormState = (props: UseResourceFormStateProps) => {
  const selectAllByDefault = props.type === "curriculum";

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
      resources: selectAllByDefault ? props.curriculumResources : [],
    },
  });

  const [selectAllChecked, setSelectAllChecked] = useState(selectAllByDefault);

  const [isLocalStorageLoading, setIsLocalStorageLoading] = useState(true);
  const [schoolUrn, setSchoolUrn] = useState("");

  const [hubspotLoaded, setHubspotLoaded] = useState(false);
  const [schoolFromHubspot, setSchoolFromHubspot] = useState<null | {
    schoolId: string;
    schoolName: string;
  }>(null);

  const { isSignedIn, user } = useUser();

  const {
    schoolFromLocalStorage,
    emailFromLocalStorage,
    termsFromLocalStorage,
    hasDetailsFromLocalStorage,
    setEmailInLocalStorage,
    setSchoolInLocalStorage,
    setTermsInLocalStorage,
  } = useLocalStorageForDownloads();

  const {
    schoolName: schoolNameFromLocalStorage,
    schoolId: schoolIdFromLocalStorage,
  } = schoolFromLocalStorage;

  useEffect(() => {
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    const updateUserDetailsFromHubspot = async (email: string) => {
      const hubspotContact = await fetchHubspotContactDetails();
      setTermsInLocalStorage(true);
      setValue("terms", true);

      setEmailInLocalStorage(email);
      setValue("email", email);

      if (hubspotContact) {
        const schoolUrn = hubspotContact.schoolId;
        // @sonar-ignore
        // current sonar rule typescript:S6606 incorrectly flags this, see open issue here https://sonarsource.atlassian.net/browse/JS-373
        const schoolName = hubspotContact.schoolName || "notListed";
        // @sonar-end

        // hubspot stores schoolUrn isolated from schoolName, but we need to store them together in local storage
        const schoolId = schoolUrn ? `${schoolUrn}-${schoolName}` : "notListed";

        const school = {
          schoolId,
          schoolName,
        };

        setSchoolInLocalStorage(school);
        setSchoolFromHubspot(school);

        if (schoolName) {
          setValue("schoolName", schoolName);
        }

        if (schoolId) {
          setValue("school", schoolId);
        }
      }
    };

    if (userEmail && isSignedIn) {
      updateUserDetailsFromHubspot(userEmail);
    }
  }, [
    isSignedIn,
    setEmailInLocalStorage,
    setSchoolInLocalStorage,
    setTermsInLocalStorage,
    setValue,
    user?.emailAddresses,
  ]);

  // Set finished loading when local storage matches hubspot or when no details expected in hubspot
  useEffect(() => {
    const detailsUpdatedFromHubspot =
      schoolFromHubspot?.schoolId === schoolFromLocalStorage.schoolId &&
      schoolFromHubspot?.schoolName === schoolFromLocalStorage.schoolName;

    const noDetailsInHubspot =
      isSignedIn === false ||
      (isSignedIn && !user?.publicMetadata?.owa?.isOnboarded); // user has signed in but not onboarded

    if ((detailsUpdatedFromHubspot || noDetailsInHubspot) && !hubspotLoaded) {
      setHubspotLoaded(true);
    }
  }, [
    schoolFromHubspot,
    schoolFromLocalStorage,
    isSignedIn,
    hubspotLoaded,
    user,
  ]);

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
    emailFromLocalStorage,
    schoolIdFromLocalStorage,
    setValue,
    termsFromLocalStorage,
  ]);

  const resources = (() => {
    switch (props.type) {
      case "share":
        return props.shareResources;
      case "download":
        return props.downloadResources;
      case "curriculum":
        return props.curriculumResources;
    }
  })();

  const additionalResources =
    props.type === "download" && props.additionalFilesResources;

  const getInitialResourcesState = useCallback(() => {
    if (props.type === "share") {
      return (resources as LessonShareData["shareableResources"])
        .filter((resource) => resource.exists)
        .map((resource) => resource.type);
    } else if (props.type === "download") {
      return (resources as LessonDownloadsPageData["downloads"])
        .filter((resource) => resource.exists && !resource.forbidden)
        .map((resource) => resource.type);
    } else if (props.type === "curriculum") {
      return resources as DownloadType[];
    } else {
      throw new Error("Invalid resource type");
    }
  }, [resources, props.type]);

  const getInitialAdditionalFilesState = useCallback(() => {
    if (props.type === "download") {
      return (additionalResources as LessonDownloadsPageData["additionalFiles"])
        .filter(
          (additionalResource) =>
            additionalResource.exists && !additionalResource.forbidden,
        )
        .map((resource) => `${resource.type}-${resource.assetId.toString()}`);
    }
  }, [additionalResources, props.type]);

  useEffect(() => {
    setIsLocalStorageLoading(false);
  }, [hasDetailsFromLocalStorage]);

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

  const { errors, submitCount } = formState;
  const hasFormErrors = Object.keys(errors)?.length > 0;
  const selectedResources = watch("resources") as ResourceType[];

  const [activeResources, setActiveResources] = useState<string[]>(
    getInitialResourcesState(),
  );

  const [activeAdditonalFiles, setActiveAdditonalFiles] = useState<
    string[] | undefined
  >(getInitialAdditionalFilesState());

  const hasResources = getInitialResourcesState().length > 0;

  // Keep selectAllChecked in sync by comparing selected resources to available resources
  useEffect(() => {
    if (selectedResources?.length < activeResources.length) {
      setSelectAllChecked(false);
    } else {
      setSelectAllChecked(true);
    }
  }, [selectedResources, activeResources]);

  const onSelectAllClick = () =>
    setValue("resources", activeResources.concat(activeAdditonalFiles || []));
  const onDeselectAllClick = () => setValue("resources", []);

  const handleEditDetailsCompletedClick = () => {
    setEditDetailsClicked(true);
    setLocalStorageDetails(false);
    setValue("email", emailFromLocalStorage);
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (router && !router.isReady) return;
    if (props.type === "curriculum") return;

    const getPreselectedQuery = () => {
      const value = searchParams?.get("preselected");

      const result =
        props.type === "download"
          ? preselectedDownloadType.safeParse(value)
          : preselectedShareType.safeParse(value);

      return result.success ? result.data : "all";
    };

    const getAllAvailableResources = () =>
      getInitialResourcesState().concat(
        (getInitialAdditionalFilesState() || []) as ResourceType[],
      );

    const getPreselectedResources = () => {
      const queryResult = getPreselectedQuery();

      if (props.type === "share" && isPreselectedShareType(queryResult)) {
        return getPreselectedShareResourceTypes(queryResult);
      }

      if (props.type === "download" && isPreselectedDownloadType(queryResult)) {
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
    getInitialResourcesState,
    getInitialAdditionalFilesState,
    props.type,
    router,
    router?.isReady,
    searchParams,
    resources,
    additionalResources,
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
    shouldDisplayDetailsCompleted,
    handleEditDetailsCompletedClick,
    selectedResources,
    schoolUrn,
    hasFormErrors,
    setEmailInLocalStorage,
    setSchoolInLocalStorage,
    setTermsInLocalStorage,
    localStorageDetails,
    editDetailsClicked,
    setEditDetailsClicked,
    activeResources,
    setActiveResources,
    activeAdditonalFiles,
    setActiveAdditonalFiles,
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
