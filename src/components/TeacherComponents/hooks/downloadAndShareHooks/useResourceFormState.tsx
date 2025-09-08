import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

import { fetchHubspotContactDetails } from "../../helpers/downloadAndShareHelpers/fetchHubspotContactDetails";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

import {
  getSchoolOption,
  getSchoolUrn,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import {
  ResourceFormProps,
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
import { CurriculumDownload } from "@/components/CurriculumComponents/CurriculumDownloads/CurriculumDownloads";
import { LessonShareData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

export type UseResourceFormStateProps =
  | { shareResources: LessonShareData["shareableResources"]; type: "share" }
  | {
      downloadResources: LessonDownloadsPageData["downloads"];
      additionalFilesResources: LessonDownloadsPageData["additionalFiles"];
      type: "download";
    }
  | { curriculumResources: CurriculumDownload[]; type: "curriculum" };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      return (resources as CurriculumDownload[]).map(
        (resource) => resource.url,
      );
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

  const { errors } = formState;
  const hasFormErrors = Object.keys(errors)?.length > 0;
  const selectedResources = (watch().resources || []) as ResourceType[];

  const [activeResources, setActiveResources] = useState<string[]>(
    getInitialResourcesState(),
  );

  const [activeAdditonalFiles, setActiveAdditonalFiles] = useState<
    string[] | undefined
  >(getInitialAdditionalFilesState());

  useEffect(() => {
    setActiveResources(getInitialResourcesState());
  }, [getInitialResourcesState, resources]);

  useEffect(() => {
    setActiveAdditonalFiles(getInitialAdditionalFilesState());
  }, [getInitialAdditionalFilesState, additionalResources]);

  const hasResources = getInitialResourcesState().length > 0;

  const onSelectAllClick = () =>
    setValue("resources", activeResources.concat(activeAdditonalFiles || []));
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
    const allAvailableResources = getInitialResourcesState().concat(
      getInitialAdditionalFilesState() || [],
    );

    if (isPreselectedShareType(queryResults)) {
      preselected = getPreselectedShareResourceTypes(queryResults);
    }
    if (isPreselectedDownloadType(queryResults)) {
      const preselectedResources = additionalResources
        ? resources.concat(additionalResources)
        : resources;
      preselected = getPreselectedDownloadResourceTypes(
        queryResults,
        preselectedResources as LessonDownloadsPageData["downloads"],
      );
    }

    if (preselected && props.type !== "curriculum") {
      setPreselectAll(preselected === "all");

      switch (true) {
        case preselected === "all":
          setValue("resources", allAvailableResources);
          break;
        case preselected.includes("additional-files"):
          if (additionalResources) {
            const preselectedAdditionalResourcesList = additionalResources.map(
              (resource) =>
                `additional-files-${resource.assetId}` as ResourceType,
            );
            const precelectedResourcesList = preselected
              .concat(preselectedAdditionalResourcesList)
              .filter((p) => p !== "additional-files");
            setValue("resources", precelectedResourcesList);
          }
          break;
        default:
          setValue("resources", preselected);
          break;
      }
    }
  }, [
    getInitialResourcesState,
    getInitialAdditionalFilesState,
    props.type,
    router.query.preselected,
    resources,
    additionalResources,
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
      formState,
      getInitialResourcesState,
      errors,
      control,
      register,
      handleSubmit,
    },
  };
};
