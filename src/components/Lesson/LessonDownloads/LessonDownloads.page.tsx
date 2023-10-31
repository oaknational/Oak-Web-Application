import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import Flex from "@/components/Flex";
import Box from "@/components/Box";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import { Heading, Hr, LI, P, UL } from "@/components/Typography";
import OakLink from "@/components/OakLink";
import Button from "@/components/Button";
import Input from "@/components/Input";
import useAnalytics from "@/context/Analytics/useAnalytics";
import Grid, { GridArea } from "@/components/Grid";
import { type LessonDownloadsData } from "@/node-lib/curriculum-api";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import getFormattedDetailsForTracking from "@/components/DownloadComponents/helpers/getFormattedDetailsForTracking";
import getDownloadFormErrorMessage from "@/components/DownloadComponents/helpers/getDownloadFormErrorMessage";
import useDownloadExistenceCheck from "@/components/DownloadComponents/hooks/useDownloadExistenceCheck";
import useLocalStorageForDownloads from "@/components/DownloadComponents/hooks/useLocalStorageForDownloads";
import useDownloadForm from "@/components/DownloadComponents/hooks/useDownloadForm";
import { getPreselectedDownloadResourceTypes } from "@/components/DownloadComponents/helpers/getDownloadResourceType";
import {
  ResourcesToDownloadArrayType,
  ErrorKeysType,
  DownloadFormProps,
  DownloadResourceType,
  preselectedDownloadType,
  schema,
} from "@/components/DownloadComponents/downloads.types";
import TermsAndConditionsCheckbox from "@/components/DownloadComponents/TermsAndConditionsCheckbox";
import Breadcrumbs from "@/components/Breadcrumbs";
import DownloadCardGroup from "@/components/DownloadComponents/DownloadCard/DownloadCardGroup";
import FieldError from "@/components/FormFields/FieldError";
import SchoolDetails from "@/components/DownloadComponents/SchoolDetails";
import DetailsCompleted from "@/components/DownloadComponents/DetailsCompleted";
import NoResourcesToDownload from "@/components/DownloadComponents/NoResourcesToDownload";
import debouncedSubmit from "@/components/DownloadComponents/helpers/downloadDebounceSubmit";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import CopyrightNotice from "@/components/DownloadComponents/CopyrightNotice/CopyrightNotice";
import {
  getLessonOverviewBreadCrumb,
  getLessonDownloadsBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getCommonPathway,
} from "@/components/Lesson/lesson.helpers";
import { LessonPathway } from "@/components/Lesson/lesson.types";
import Icon from "@/components/Icon";

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
    hasDetailsFromLocalStorage && !editDetailsClicked;
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
      setApiError(
        "There was an error downloading your files. Please try again.",
      );
    }
  };

  const getFormErrorMessages = () => {
    const errorKeyArray = Object.keys(errors);

    const errorMessage = getDownloadFormErrorMessage(
      errorKeyArray as ErrorKeysType[],
    );

    return errorMessage;
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

  const showPostAlbCopyright = !isLegacy;

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
        <Heading $mb={32} tag={"h1"} $font={["heading-5", "heading-4"]}>
          Download
        </Heading>

        {!hasResourcesToDownload ? (
          <NoResourcesToDownload />
        ) : (
          <>
            {isLocalStorageLoading && <P $mt={24}>Loading...</P>}
            {!isLocalStorageLoading && (
              <Flex $flexDirection="column" $gap={24}>
                {localStorageDetails ? (
                  <DetailsCompleted
                    email={emailFromLocalStorage}
                    school={schoolNameFromLocalStorage}
                    onEditClick={handleEditDetailsCompletedClick}
                  />
                ) : (
                  <Box $maxWidth={[null, 420, 420]}>
                    {errors?.school && (
                      <FieldError id="school-error">
                        {errors?.school?.message}
                      </FieldError>
                    )}
                    <SchoolDetails
                      errors={errors}
                      setSchool={setSchool}
                      initialValue={
                        schoolIdFromLocalStorage?.length > 0
                          ? schoolIdFromLocalStorage
                          : undefined
                      }
                      initialSchoolName={
                        schoolNameFromLocalStorage.length > 0
                          ? schoolNameFromLocalStorage.charAt(0).toUpperCase() +
                            schoolNameFromLocalStorage.slice(1)
                          : undefined
                      }
                    />

                    <Input
                      id={"email"}
                      data-testid="input-email"
                      label="Email"
                      autoComplete="email"
                      placeholder="Enter email address here"
                      isOptional={true}
                      {...register("email")}
                      error={errors.email?.message}
                    />
                    <P $font="body-3" $mt={-20} $mb={48}>
                      Join over 100k teachers and get free resources and other
                      helpful content by email. Unsubscribe at any time. Read
                      our{" "}
                      <OakLink
                        page="legal"
                        legalSlug="privacy-policy"
                        $isInline
                        htmlAnchorProps={{
                          target: "_blank",
                          "aria-label": "Privacy policy (opens in a new tab)",
                        }}
                      >
                        privacy policy{" "}
                        <Icon
                          name="external"
                          verticalAlign="bottom"
                          size={20}
                          data-testid="external-link-icon"
                        />
                      </OakLink>
                      .
                    </P>
                    <Controller
                      control={control}
                      name="terms"
                      render={({
                        field: { value, onChange, name, onBlur },
                      }) => {
                        const onChangeHandler = (
                          e: ChangeEvent<HTMLInputElement>,
                        ) => {
                          return onChange(e.target.checked);
                        };
                        return (
                          <TermsAndConditionsCheckbox
                            name={name}
                            checked={value}
                            onChange={onChangeHandler}
                            onBlur={onBlur}
                            id={"terms"}
                            errorMessage={errors?.terms?.message}
                          />
                        );
                      }}
                    />
                  </Box>
                )}
                <Box $mb={56}>
                  <CopyrightNotice
                    showPostAlbCopyright={showPostAlbCopyright}
                    openLinksExternally={true}
                  />
                </Box>
              </Flex>
            )}

            <Grid>
              <DownloadCardGroup
                control={control}
                downloads={downloads}
                hasError={errors?.downloads ? true : false}
                errorMessage={errors?.downloads?.message}
                onSelectAllClick={() => onSelectAllClick()}
                onDeselectAllClick={() => onDeselectAllClick()}
                preselectAll={preselectAll}
                triggerForm={trigger}
              />

              <GridArea $colSpan={[12]}>
                <Flex
                  $flexDirection={["column", "row"]}
                  $justifyContent={"right"}
                  $alignItems={"center"}
                >
                  {hasFormErrors && (
                    <Flex $flexDirection={"row"}>
                      <Icon name="content-guidance" $color={"red"} $mr={4} />
                      <Flex $flexDirection={"column"}>
                        <P $color={"red"}>To complete correct the following:</P>
                        <UL $mr={24}>
                          {getFormErrorMessages().map((err) => {
                            return <LI $color={"red"}>{err}</LI>;
                          })}
                        </UL>
                      </Flex>
                    </Flex>
                  )}
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
                  <Flex $justifyContent={"right"} $alignItems={"center"}>
                    <Button
                      label={"Download .zip"}
                      onClick={
                        (event) => void handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622
                      }
                      background={"teachersHighlight"}
                      icon="download"
                      $iconPosition="trailing"
                      iconBackground="teachersYellow"
                      disabled={isAttemptingDownload}
                      $mt={8}
                      $mb={16}
                      $mr={8}
                      $ml={8}
                    />
                  </Flex>
                </Flex>
              </GridArea>
            </Grid>
          </>
        )}
      </MaxWidth>
    </Box>
  );
}
