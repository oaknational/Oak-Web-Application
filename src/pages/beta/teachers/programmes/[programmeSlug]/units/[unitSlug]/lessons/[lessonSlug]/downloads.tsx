import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from "next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import AppLayout from "../../../../../../../../../components/AppLayout";
import Flex from "../../../../../../../../../components/Flex";
import Box from "../../../../../../../../../components/Box";
import MaxWidth from "../../../../../../../../../components/MaxWidth/MaxWidth";
import TitleCard from "../../../../../../../../../components/Card/SubjectUnitLessonTitleCard";
import {
  Heading,
  Hr,
  P,
} from "../../../../../../../../../components/Typography";
import OakLink from "../../../../../../../../../components/OakLink";
import Button from "../../../../../../../../../components/Button";
import Input from "../../../../../../../../../components/Input";
import { getSeoProps } from "../../../../../../../../../browser-lib/seo/getSeoProps";
import useAnalytics from "../../../../../../../../../context/Analytics/useAnalytics";
import Grid, { GridArea } from "../../../../../../../../../components/Grid";
import curriculumApi, {
  type LessonDownloadsData,
} from "../../../../../../../../../node-lib/curriculum-api";
import { KeyStageTitleValueType } from "../../../../../../../../../browser-lib/avo/Avo";
import getFormattedDetailsForTracking from "../../../../../../../../../components/DownloadComponents/helpers/getFormattedDetailsForTracking";
import getDownloadFormErrorMessage from "../../../../../../../../../components/DownloadComponents/helpers/getDownloadFormErrorMessage";
import useDownloadExistenceCheck from "../../../../../../../../../components/DownloadComponents/hooks/useDownloadExistenceCheck";
import useLocalStorageForDownloads from "../../../../../../../../../components/DownloadComponents/hooks/useLocalStorageForDownloads";
import useDownloadForm from "../../../../../../../../../components/DownloadComponents/hooks/useDownloadForm";
import { getPreselectedDownloadResourceTypes } from "../../../../../../../../../components/DownloadComponents/helpers/getDownloadResourceType";
import {
  ResourcesToDownloadArrayType,
  ErrorKeysType,
  DownloadFormProps,
  DownloadResourceType,
  preselectedDownloadType,
  schema,
} from "../../../../../../../../../components/DownloadComponents/downloads.types";
import TermsAndConditionsCheckbox from "../../../../../../../../../components/DownloadComponents/TermsAndConditionsCheckbox";
import Breadcrumbs from "../../../../../../../../../components/Breadcrumbs";
import { lessonBreadcrumbArray } from "../[lessonSlug]";
import DownloadCardGroup from "../../../../../../../../../components/DownloadComponents/DownloadCard/DownloadCardGroup";
import FieldError from "../../../../../../../../../components/FormFields/FieldError";
import SchoolPickerRadio from "../../../../../../../../../components/DownloadComponents/SchoolpickerRadio";
import DetailsCompleted from "../../../../../../../../../components/DownloadComponents/DetailsCompleted";
import NoResourcesToDownload from "../../../../../../../../../components/DownloadComponents/NoResourcesToDownload";
import debouncedSubmit from "../../../../../../../../../components/DownloadComponents/helpers/downloadDebounceSubmit";
import useAnalyticsPageProps from "../../../../../../../../../hooks/useAnalyticsPageProps";

export type LessonDownloadsPageProps = {
  curriculumData: LessonDownloadsData;
};

const LessonDownloadsPage: NextPage<LessonDownloadsPageProps> = ({
  curriculumData,
}) => {
  const {
    lessonTitle,
    lessonSlug,
    programmeSlug,
    keyStageTitle,
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    downloads,
    unitSlug,
    unitTitle,
  } = curriculumData;

  const router = useRouter();
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const { register, formState, control, watch, setValue, handleSubmit } =
    useForm<DownloadFormProps>({
      resolver: zodResolver(schema),
      mode: "onBlur",
    });

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
    [setValue, schoolNameFromLocalStorage]
  );

  const { errors } = formState;
  const hasFormErrors = Object.keys(errors)?.length > 0;
  const selectedResources = (watch().downloads || []) as DownloadResourceType[];

  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);

  const [resourcesToDownload, setResourcesToDownload] =
    useState<ResourcesToDownloadArrayType>(
      getInitialResourcesToDownloadState()
    );

  const hasResourcesToDownload =
    getInitialResourcesToDownloadState().length > 0;

  const onSelectAllClick = () => setValue("downloads", resourcesToDownload);
  const onDeselectAllClick = () => setValue("downloads", []);

  const allResourcesToDownloadCount = resourcesToDownload.length;
  const selectedResourcesToDownloadCount = selectedResources?.length;

  const { onSubmit } = useDownloadForm();

  const onFormSubmit = async (data: DownloadFormProps): Promise<void> => {
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
  };

  const getFormErrorMessage = () => {
    const errorKeyArray = Object.keys(errors);
    const errorMessage = getDownloadFormErrorMessage(
      errorKeyArray as ErrorKeysType[]
    );

    return errorMessage;
  };

  useDownloadExistenceCheck({
    lessonSlug,
    resourcesToCheck: resourcesToDownload,
    onComplete: setResourcesToDownload,
  });

  const handleEditDetailsCompletedClick = () => {
    setEditDetailsClicked(true);
    setLocalStorageDetails(false);
  };

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson Download: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description: "Lesson downloads",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
    >
      <MaxWidth $ph={[12]} $maxWidth={[480, 840, 1280]}>
        <Box $mv={[24, 48]}>
          <Breadcrumbs
            breadcrumbs={[
              ...lessonBreadcrumbArray(
                keyStageTitle,
                keyStageSlug,
                programmeSlug,
                subjectTitle,
                unitSlug,
                unitTitle
              ),
              {
                oakLinkProps: {
                  page: "lesson-overview",
                  programmeSlug,
                  unitSlug,
                  slug: lessonSlug,
                },
                label: lessonTitle,
              },
              {
                oakLinkProps: {
                  page: "lesson-downloads",
                  programmeSlug,
                  unitSlug,
                  lessonSlug,
                },
                label: "Downloads",
                disabled: true,
              },
            ]}
          />
        </Box>
        <Flex $mb={8} $display={"inline-flex"} $mt={0}>
          <TitleCard
            page={"lesson"}
            keyStage={keyStageTitle}
            keyStageSlug={keyStageSlug}
            subject={subjectTitle}
            subjectSlug={subjectSlug}
            title={`Downloads: ${lessonTitle}`}
          />
        </Flex>

        {!hasResourcesToDownload ? (
          <NoResourcesToDownload />
        ) : (
          <>
            {isLocalStorageLoading && <P $mt={24}>Loading...</P>}
            {!isLocalStorageLoading && (
              <>
                {localStorageDetails ? (
                  <DetailsCompleted
                    email={emailFromLocalStorage}
                    school={schoolNameFromLocalStorage}
                    onEditClick={handleEditDetailsCompletedClick}
                  />
                ) : (
                  <Box $maxWidth={[null, 420, 420]} $mb={96}>
                    <SchoolPickerRadio
                      errors={errors}
                      setSchool={setSchool}
                      initialValue={
                        schoolIdFromLocalStorage?.length > 0
                          ? schoolIdFromLocalStorage
                          : undefined
                      }
                      initialSchoolName={schoolNameFromLocalStorage}
                    />
                    <Heading
                      tag="h3"
                      $font={"heading-7"}
                      $mt={16}
                      $mb={24}
                      data-testid="email-heading"
                    >
                      For regular updates from Oak (optional)
                    </Heading>
                    <Input
                      id={"email"}
                      label="Email address"
                      placeholder="Enter email address here"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                    <P $font="body-3" $mt={-24} $mb={40}>
                      Join our community to get free lessons, resources and
                      other helpful content. Unsubscribe at any time. Our{" "}
                      <OakLink page="legal" slug="privacy-policy" $isInline>
                        privacy policy
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
                          e: ChangeEvent<HTMLInputElement>
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
              </>
            )}

            <Grid $mt={32}>
              <DownloadCardGroup
                control={control}
                downloads={downloads}
                hasError={errors?.downloads ? true : false}
                errorMessage={errors?.downloads?.message}
                onSelectAllClick={() => onSelectAllClick()}
                onDeselectAllClick={() => onDeselectAllClick()}
              />

              <GridArea $colSpan={[12]}>
                <Hr $color={"oakGrey3"} $mt={48} $mb={[48, 96]} />
                <Flex
                  $flexDirection={["column", "row"]}
                  $justifyContent={"right"}
                  $alignItems={"center"}
                >
                  {hasFormErrors && (
                    <Box $mr={24} $textAlign={"left"}>
                      <FieldError
                        id="download-form-error"
                        variant={"large"}
                        withoutMarginBottom
                      >
                        {getFormErrorMessage()}
                      </FieldError>
                    </Box>
                  )}
                  <Flex $justifyContent={"right"} $alignItems={"center"}>
                    <Box $minWidth={130} $mr={24}>
                      <P
                        $color={"oakGrey4"}
                        $font={"body-2"}
                        data-testid="selectedResourcesCount"
                      >
                        {`${selectedResourcesToDownloadCount}/${allResourcesToDownloadCount} files selected`}
                      </P>
                    </Box>
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
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  programmeSlug: string;
};

export const getServerSideProps: GetServerSideProps<
  LessonDownloadsPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new Error("No context.params");
  }
  const { lessonSlug, programmeSlug } = context.params;

  const curriculumData = await curriculumApi.lessonDownloads({
    lessonSlug,
    programmeSlug,
  });

  if (!curriculumData) {
    return {
      notFound: true,
    };
  }

  const results: GetServerSidePropsResult<LessonDownloadsPageProps> = {
    props: {
      curriculumData,
    },
  };
  return results;
};

export default LessonDownloadsPage;
