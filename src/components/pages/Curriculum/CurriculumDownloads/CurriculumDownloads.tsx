import { ChangeEvent, useState } from "react";
import { Controller } from "react-hook-form";
import { debounce } from "lodash";
import styled from "styled-components";

import Box from "@/components/SharedComponents/Box";
import useAnalytics from "@/context/Analytics/useAnalytics";
import getFormattedDetailsForTracking from "@/components/DownloadAndShareComponents/helpers/getFormattedDetailsForTracking";
import getDownloadFormErrorMessage from "@/components/DownloadAndShareComponents/helpers/getDownloadFormErrorMessage";
import {
  ErrorKeysType,
  ResourceFormProps,
} from "@/components/DownloadAndShareComponents/downloadAndShare.types";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import { useResourceFormState } from "@/components/DownloadAndShareComponents/hooks/useResourceFormState";
import Checkbox from "@/components/SharedComponents/Checkbox";
import CopyrightNotice from "@/components/DownloadAndShareComponents/CopyrightNotice";
import DetailsCompleted from "@/components/DownloadAndShareComponents/DetailsCompleted";
import SchoolDetails from "@/components/DownloadAndShareComponents/SchoolDetails";
import TermsAndConditionsCheckbox from "@/components/DownloadAndShareComponents/TermsAndConditionsCheckbox";
import Flex from "@/components/SharedComponents/Flex";
import FieldError from "@/components/FormFields/FieldError";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
import Icon from "@/components/SharedComponents/Icon";
import OakLink from "@/components/OakLink";
import { Heading, P, UL, LI } from "@/components/SharedComponents/Typography";
import Input from "@/components/SharedComponents/Input";
import ResourceCard from "@/components/DownloadAndShareComponents/ResourceCard";
import useLocalStorageForDownloads from "@/components/DownloadAndShareComponents/hooks/useLocalStorageForDownloads";
import createAndClickHiddenDownloadLink from "@/components/DownloadAndShareComponents/helpers/createAndClickHiddenDownloadLink";

export type CurriculumDownload = {
  label: string;
  url: string;
};

type CurriculumDownloadsProps = {
  category: string;
  downloads: CurriculumDownload[];
};

const CardContainer = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  > div {
    margin-right: 24px;
    margin-bottom: 24px;
    > label p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: calc(100% - 36px);
    }
  }
`;

export function CurriculumDownloads(props: CurriculumDownloadsProps) {
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
    handleToggleSelectAll,
    selectAllChecked,
  } = useResourceFormState({
    curriculumResources: downloads,
    type: "curriculum",
  });

  const {
    setSchoolInLocalStorage,
    setEmailInLocalStorage,
    setTermsInLocalStorage,
  } = useLocalStorageForDownloads();

  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);

  const [apiError, setApiError] = useState<string | null>(null);

  const [isDownloadSuccessful, setIsDownloadSuccessful] =
    useState<boolean>(false);

  const onFormSubmit = async (data: ResourceFormProps): Promise<void> => {
    setApiError(null);
    try {
      const debouncedFunction = debounce(
        async () => {
          setIsAttemptingDownload(true);
          const email = data?.email;
          const schoolId = data?.school;
          const schoolName = data?.schoolName;
          const terms = data?.terms;
          const downloads = data?.resources;
          if (email) {
            setEmailInLocalStorage(email);
          }
          if (schoolId) {
            if (schoolId === "homeschool" || schoolId === "notListed") {
              setSchoolInLocalStorage({
                schoolId,
                schoolName: schoolId,
              });
            } else {
              if (schoolName && schoolId) {
                setSchoolInLocalStorage({ schoolId, schoolName });
              }
            }
          }
          if (terms) {
            setTermsInLocalStorage(terms);
          }
          const downloadResourcesLink = downloads[0];
          if (downloadResourcesLink) {
            createAndClickHiddenDownloadLink(downloadResourcesLink);
          }
          setIsAttemptingDownload(false);
          setEditDetailsClicked(false);
        },
        4000,
        { leading: true },
      );
      await debouncedFunction();
      setIsDownloadSuccessful(true);

      if (editDetailsClicked && !data.email) {
        setEmailInLocalStorage("");
      }

      const {
        schoolOption,
        schoolName,
        schoolUrn,
        selectedResourcesForTracking,
      } = getFormattedDetailsForTracking({
        school: data.school,
        selectedResources,
      });

      track.curriculumResourcesDownloaded({
        category: category,
        subject: "Subject", // TODO: replace with "subject" once we have the correct value
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

  const getFormErrorMessages = () => {
    const errorKeyArray = Object.keys(form.errors);
    const errorMessage = getDownloadFormErrorMessage(
      errorKeyArray as ErrorKeysType[],
    );
    return errorMessage;
  };

  return (
    <Box
      $maxWidth={1280}
      $mh={"auto"}
      $width={"100%"}
      $ph={28}
      $pb={80}
      $pt={32}
    >
      {isDownloadSuccessful ? (
        <Box>Download successful!</Box>
      ) : (
        <Box $width="100%">
          <Flex
            $alignItems={"flex-start"}
            $flexDirection={"column"}
            $gap={[24, 32]}
          >
            <Heading tag="h1" $font={["heading-5", "heading-4"]}>
              {category}
            </Heading>
            <Grid>
              <GridArea $colSpan={[12, 12, 7]}>
                <Heading tag="h2" $font={["heading-6", "heading-5"]} $mb={24}>
                  Choose your downloads
                </Heading>
                <FieldError id={"downloads-error"} withoutMarginBottom>
                  {form.errors?.resources?.message}
                </FieldError>
                <Box $maxWidth="max-content">
                  <Checkbox
                    checked={selectAllChecked}
                    onChange={handleToggleSelectAll}
                    id="select-all"
                    name="select-all"
                    variant="withLabel"
                    labelText="Select all"
                    labelFontWeight={600}
                  />
                </Box>

                <CardContainer>
                  {downloads.map((download) => (
                    <Controller
                      control={form.control}
                      defaultValue={[]}
                      key={download.label}
                      name="resources"
                      render={({
                        field: { value: fieldValue, onChange, name, onBlur },
                      }) => {
                        const onChangeHandler = (
                          e: ChangeEvent<HTMLInputElement>,
                        ) => {
                          if (e.target.checked) {
                            onChange([...fieldValue, download.url]);
                          } else {
                            onChange(
                              fieldValue.filter(
                                (val: CurriculumDownload | string) =>
                                  val !== download.url,
                              ),
                            );
                          }
                          // Trigger the form to reevaluate errors
                          form.trigger();
                        };
                        return (
                          <ResourceCard
                            id={download.label}
                            name={name}
                            label={download.label}
                            subtitle={"PDF"}
                            resourceType="curriculum-pdf"
                            onChange={onChangeHandler}
                            checked={
                              selectAllChecked ||
                              fieldValue.includes(download.url)
                            }
                            onBlur={onBlur}
                            hasError={form.errors?.resources ? true : false}
                            data-testid={`download-card-${download.label}`}
                          />
                        );
                      }}
                    />
                  ))}
                </CardContainer>
              </GridArea>
              <GridArea $colSpan={[12, 12, 5]}>
                <Heading
                  tag="h2"
                  $font={["heading-6", "heading-5"]}
                  $mb={[24, 32]}
                >
                  Your details
                </Heading>
                {form.errors.school && (
                  <FieldError id="school-error">
                    {form.errors.school?.message}
                  </FieldError>
                )}
                {isLocalStorageLoading ? (
                  <P $mt={24}>Loading...</P>
                ) : (
                  <Flex $flexDirection="column" $gap={24}>
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
                          data-testid="input-email"
                          label="Email"
                          autoComplete="email"
                          placeholder="Enter email address here"
                          isOptional={true}
                          {...form.register("email")}
                          error={form.errors?.email?.message}
                        />
                        <P $font="body-3" $mt={-20} $mb={48}>
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
                              data-testid="external-link-icon"
                            />
                          </OakLink>
                          .
                        </P>
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
                                zIndex={"neutral"}
                              />
                            );
                          }}
                        />
                      </Box>
                    )}
                    <CopyrightNotice
                      // TODO: determine correct copyright to use
                      showPostAlbCopyright={true}
                      openLinksExternally={true}
                    />
                  </Flex>
                )}
                {hasFormErrors && (
                  <Flex $flexDirection={"row"}>
                    <Icon name="content-guidance" $color={"red"} />
                    <Flex $flexDirection={"column"}>
                      <P $ml={4} $color={"red"}>
                        To complete correct the following:
                      </P>
                      <UL $mr={24}>
                        {getFormErrorMessages().map((err, i) => {
                          return (
                            <LI $color={"red"} key={i}>
                              {err}
                            </LI>
                          );
                        })}
                      </UL>
                    </Flex>
                  </Flex>
                )}
                <LoadingButton
                  type="button"
                  onClick={(event) =>
                    void form.handleSubmit(onFormSubmit)(event)
                  }
                  text={"Download .zip"}
                  icon={"download"}
                  isLoading={isAttemptingDownload}
                  disabled={
                    hasFormErrors ||
                    (!form.formState.isValid && !localStorageDetails)
                  }
                  loadingText={"Downloading..."}
                />

                {apiError && !hasFormErrors && (
                  <FieldError
                    id="download-error"
                    data-testid="download-error"
                    variant={"large"}
                    withoutMarginBottom
                  >
                    {apiError}
                  </FieldError>
                )}
              </GridArea>
            </Grid>
          </Flex>
        </Box>
      )}
    </Box>
  );
}

export default CurriculumDownloads;
