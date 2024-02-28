import {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";
import styled from "styled-components";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakUL,
  OakLI,
  OakP,
} from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import useAnalytics from "@/context/Analytics/useAnalytics";
import getFormattedDetailsForTracking from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import getDownloadFormErrorMessage from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadFormErrorMessage";
import {
  ErrorKeysType,
  ResourceFormProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import CopyrightNotice from "@/components/TeacherComponents/CopyrightNotice";
import DetailsCompleted from "@/components/TeacherComponents/ResourcePageDetailsCompleted";
import SchoolDetails from "@/components/TeacherComponents/ResourcePageSchoolDetails";
import TermsAndConditionsCheckbox from "@/components/TeacherComponents/ResourcePageTermsAndConditionsCheckbox";
import FieldError from "@/components/SharedComponents/FieldError";
import Icon from "@/components/SharedComponents/Icon";
import OakLink from "@/components/SharedComponents/OwaLink";
import Input from "@/components/SharedComponents/Input";
import ResourceCard from "@/components/TeacherComponents/ResourceCard";
import useLocalStorageForDownloads from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import RadioGroup from "@/components/SharedComponents/RadioButtons/RadioGroup";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";

export type CurriculumDownload = {
  label: string;
  url: string;
  icon: string;
};

export type CurriculumDownloadsRef = {
  clearSelection: () => void;
};

type CurriculumDownloadsProps = {
  category: string;
  downloads: CurriculumDownload[];
};

const CardsContainer = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  > div > div {
    display: inline-flex;
    margin-right: 16px;
    margin-bottom: 16px;
  }
`;

function CurriculumDownloads(
  props: CurriculumDownloadsProps,
  ref: React.ForwardedRef<CurriculumDownloadsRef>,
) {
  const router = useRouter();
  const { category, downloads } = props;
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const {
    form,
    emailFromLocalStorage,
    schoolIdFromLocalStorage,
    schoolNameFromLocalStorage,
    isLocalStorageLoading,
    setSchool,
    shouldDisplayDetailsCompleted,
    handleEditDetailsCompletedClick,
    setEditDetailsClicked,
    editDetailsClicked,
    selectedResources,
    hasFormErrors,
    localStorageDetails,
  } = useResourceFormState({
    curriculumResources: downloads,
    type: "curriculum",
  });

  const {
    setSchoolInLocalStorage,
    setEmailInLocalStorage,
    setTermsInLocalStorage,
  } = useLocalStorageForDownloads();

  const handleLocalStorageUpdates = (data: {
    email?: string | undefined;
    school: string;
    schoolName: string;
    terms: boolean;
  }) => {
    const { email, school, schoolName, terms } = data;
    if (email) setEmailInLocalStorage(email);
    if (terms) setTermsInLocalStorage(terms);

    const isSpecialSchool = school === "homeschool" || school === "notListed";
    if (school) {
      setSchoolInLocalStorage({
        schoolId: school,
        schoolName: isSpecialSchool ? school : schoolName,
      });
    }
  };

  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);
  const [hasSuccessfullyDownloaded, setHasSuccessfullyDownloaded] =
    useState<boolean>(false);
  const [hasSetPreselectedDownload, setHasSetPreselectedDownload] =
    useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string>("");

  const { onHubspotSubmit } = useHubspotSubmit();

  const clearSelection = () => {
    setSelectedUrl("");
    form.setValue("resources", []);
  };

  useImperativeHandle(ref, () => ({
    clearSelection: clearSelection,
  }));

  const handleDownload = (url: string) => {
    if (!url) return false;
    createAndClickHiddenDownloadLink(url);
    return true;
  };

  const trackDownloadAnalytics = (
    data: { email?: string | undefined; school: string },
    selectedDownload: CurriculumDownload,
  ) => {
    const { email, school } = data;
    const {
      schoolOption,
      schoolName,
      schoolUrn,
      selectedResourcesForTracking,
    } = getFormattedDetailsForTracking({
      school,
      selectedResources,
    });

    track.curriculumResourcesDownloaded({
      category: category,
      subject: selectedDownload ? selectedDownload.label : "None Specified",
      resourceType: selectedResourcesForTracking,
      analyticsUseCase,
      schoolUrn,
      schoolName,
      schoolOption,
      emailSupplied: !!email,
    });
  };

  // Simplified onFormSubmit using helper functions
  const onFormSubmit = async (data: ResourceFormProps) => {
    try {
      setApiError(null);
      await onHubspotSubmit(data);
      setIsAttemptingDownload(true);

      const { email, school, schoolName, terms } = data;
      handleLocalStorageUpdates({
        email,
        school,
        schoolName: schoolName || "", // Ensure schoolName is a string
        terms,
      });

      const downloadSuccess = handleDownload(data?.resources[0] ?? "");
      if (downloadSuccess) {
        setHasSuccessfullyDownloaded(true);
      }
      const selectedDownload = downloads.find(
        (download) => download.url === data?.resources[0],
      );
      if (selectedDownload) {
        trackDownloadAnalytics(data, selectedDownload);
      }

      setIsAttemptingDownload(false);
      setEditDetailsClicked(false);
      if (editDetailsClicked && !data.email) setEmailInLocalStorage("");
    } catch (error) {
      setIsAttemptingDownload(false);
      setHasSuccessfullyDownloaded(false);
      setApiError(
        "There was an error downloading your files. Please try again.",
      );
    }
  };

  const getFormErrorMessages = () => {
    const errorKeyArray = Object.keys(form.errors);
    const errorMessage = getDownloadFormErrorMessage(
      errorKeyArray as ErrorKeysType[],
    );
    return errorMessage;
  };

  useEffect(() => {
    if (hasSetPreselectedDownload) {
      return;
    }
    const subject = router.query.subject as string;
    if (subject) {
      const selectedDownload = downloads.find((download) =>
        download.url.endsWith(subject),
      );
      if (selectedDownload) {
        setHasSetPreselectedDownload(true);
        setSelectedUrl(selectedDownload.url);
        form.setValue("resources", [selectedDownload.url]);
      }
    }
  }, [downloads, router.query.subject, hasSetPreselectedDownload, form]);

  return (
    <Box
      $maxWidth={1280}
      $mh={"auto"}
      $width={"100%"}
      $ph={28}
      $pb={80}
      $pt={32}
    >
      <Box $width="100%">
        <OakFlex
          $alignItems={"flex-start"}
          $flexDirection={"column"}
          $gap={["space-between-m", "space-between-m2"]}
        >
          <OakHeading
            tag="h2"
            $font={["heading-5", "heading-4"]}
            data-testid="heading2"
          >
            {category}
          </OakHeading>
          <form onChange={() => setHasSuccessfullyDownloaded(false)}>
            <OakGrid>
              <OakGridArea $colSpan={[12, 12, 7]}>
                <OakHeading
                  tag="h2"
                  $font={["heading-6", "heading-5"]}
                  $mb={"space-between-m"}
                >
                  Choose your download
                </OakHeading>
                <FieldError
                  id={"downloads-error"}
                  withoutMarginBottom
                  data-testid="downloadsError"
                >
                  {form.errors?.resources?.message}
                </FieldError>
                <CardsContainer data-testid="cardsContainer">
                  <RadioGroup
                    aria-label="Subject Download Options"
                    value={selectedUrl}
                    onChange={(e) => {
                      if (e === "") {
                        form.setValue("resources", []);
                      } else {
                        setSelectedUrl(e);
                        form.setValue("resources", [e]);
                        if (form.errors.resources) {
                          form.errors.resources = undefined;
                          form.trigger();
                        }
                      }
                    }}
                  >
                    {downloads.map((download) => (
                      <ResourceCard
                        key={download.label}
                        id={download.url}
                        name={download.label}
                        label={download.label}
                        subtitle={"PDF"}
                        resourceType="curriculum-pdf"
                        onChange={() => {}}
                        checked={false}
                        onBlur={() => {}}
                        hasError={form.errors?.resources ? true : false}
                        useRadio={true}
                        subjectIcon={download.icon}
                      />
                    ))}
                  </RadioGroup>
                </CardsContainer>
              </OakGridArea>
              <OakGridArea $colSpan={[12, 12, 5]}>
                <OakHeading
                  tag="h2"
                  $font={["heading-6", "heading-5"]}
                  $mb={["space-between-m", "space-between-m2"]}
                >
                  Your details
                </OakHeading>
                {form.errors.school && (
                  <FieldError id="school-error">
                    {form.errors.school?.message}
                  </FieldError>
                )}
                {isLocalStorageLoading ? (
                  <OakP $mb={"space-between-s"}>Loading...</OakP>
                ) : (
                  <OakFlex
                    $flexDirection="column"
                    $gap={"space-between-m"}
                    $mb={"space-between-s"}
                  >
                    {shouldDisplayDetailsCompleted ? (
                      <DetailsCompleted
                        email={emailFromLocalStorage}
                        school={schoolNameFromLocalStorage}
                        onEditClick={handleEditDetailsCompletedClick}
                      />
                    ) : (
                      <Box $maxWidth={[null, 420, 420]}>
                        <SchoolDetails
                          errors={form.errors}
                          setSchool={setSchool}
                          initialValue={schoolIdFromLocalStorage ?? undefined}
                          initialSchoolName={
                            schoolNameFromLocalStorage?.length &&
                            schoolNameFromLocalStorage?.length > 0
                              ? schoolNameFromLocalStorage
                                  .charAt(0)
                                  .toUpperCase() +
                                schoolNameFromLocalStorage.slice(1)
                              : undefined
                          }
                        />

                        <Input
                          id={"email"}
                          data-testid="inputEmail"
                          label="Email"
                          autoComplete="email"
                          placeholder="Enter email address here"
                          isOptional={true}
                          {...form.register("email")}
                          error={form.errors?.email?.message}
                        />
                        <OakP $font="body-3" $mb={"space-between-l"}>
                          Join over 100k teachers and get free resources and
                          other helpful content by email. Unsubscribe at any
                          time. Read our{" "}
                          <OakLink
                            page="legal"
                            legalSlug="privacy-policy"
                            $isInline
                            htmlAnchorProps={{
                              target: "_blank",
                              "aria-label":
                                "Privacy policy (opens in a new tab)",
                            }}
                          >
                            privacy policy
                            <Icon
                              name="external"
                              verticalAlign="bottom"
                              size={20}
                            />
                          </OakLink>
                          .
                        </OakP>
                        <Controller
                          control={form.control}
                          name="terms"
                          render={({
                            field: { value, onChange, name, onBlur },
                          }) => {
                            const onChangeHandler = (
                              e: ChangeEvent<HTMLInputElement>,
                            ) => {
                              onChange(e.target.checked);
                              form.trigger();
                            };
                            return (
                              <TermsAndConditionsCheckbox
                                name={name}
                                checked={value}
                                onChange={onChangeHandler}
                                onBlur={onBlur}
                                id={"terms"}
                                errorMessage={form.errors?.terms?.message}
                              />
                            );
                          }}
                        />
                      </Box>
                    )}
                    <CopyrightNotice
                      showPostAlbCopyright={true}
                      openLinksExternally={true}
                    />
                  </OakFlex>
                )}
                {hasFormErrors && (
                  <OakFlex $flexDirection={"row"} $mb={"space-between-s"}>
                    <Icon name="content-guidance" $color={"red"} />
                    <OakFlex $flexDirection={"column"}>
                      <OakP $ml={"space-between-sssx"} $color={"red"}>
                        To complete correct the following:
                      </OakP>
                      <OakUL $mr={"space-between-m"} data-testid="errorList">
                        {getFormErrorMessages().map((err, i) => {
                          return (
                            <OakLI $color={"red"} key={i}>
                              {err}
                            </OakLI>
                          );
                        })}
                      </OakUL>
                    </OakFlex>
                  </OakFlex>
                )}
                <LoadingButton
                  type="button"
                  onClick={(event) =>
                    void form.handleSubmit(onFormSubmit)(event)
                  }
                  text={"Download PDF"}
                  icon={"download"}
                  isLoading={isAttemptingDownload}
                  disabled={
                    hasFormErrors ||
                    (!form.formState.isValid && !localStorageDetails)
                  }
                  loadingText={"Downloading..."}
                />
                {hasSuccessfullyDownloaded && (
                  <OakP $mt={"space-between-m"} data-testid="downloadSuccess">
                    Download Successful!
                  </OakP>
                )}
                {apiError && !hasFormErrors && (
                  <FieldError
                    id="download-error"
                    variant={"large"}
                    withoutMarginBottom
                  >
                    {apiError}
                  </FieldError>
                )}
              </OakGridArea>
            </OakGrid>
          </form>
        </OakFlex>
      </Box>
    </Box>
  );
}

export default forwardRef(CurriculumDownloads);
