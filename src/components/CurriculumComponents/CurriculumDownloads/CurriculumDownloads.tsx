import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { Controller } from "react-hook-form";
import { debounce } from "lodash";
import styled from "styled-components";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

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
import Flex from "@/components/SharedComponents/Flex";
import FieldError from "@/components/SharedComponents/FieldError";
import Icon from "@/components/SharedComponents/Icon";
import OakLink from "@/components/SharedComponents/OwaLink";
import { Heading, P, UL, LI } from "@/components/SharedComponents/Typography";
import Input from "@/components/SharedComponents/Input";
import ResourceCard from "@/components/TeacherComponents/ResourceCard";
import useLocalStorageForDownloads from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads";
import createAndClickHiddenDownloadLink from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
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

  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);

  const { onHubspotSubmit } = useHubspotSubmit();
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string>("");

  const clearSelection = () => {
    setSelectedUrl("");
    form.setValue("resources", []);
  };

  useImperativeHandle(ref, () => ({
    clearSelection: clearSelection,
  }));

  const onFormSubmit = async (data: ResourceFormProps): Promise<void> => {
    setApiError(null);
    await onHubspotSubmit(data);
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

      const selectedDownload = downloads.filter((download) => {
        return download.url === selectedResources[0];
      })[0];

      track.curriculumResourcesDownloaded({
        category: category,
        subject: selectedDownload ? selectedDownload.label : "None Specified",
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
      <Box $width="100%">
        <Flex
          $alignItems={"flex-start"}
          $flexDirection={"column"}
          $gap={[24, 32]}
        >
          <Heading tag="h1" $font={["heading-5", "heading-4"]}>
            {category}
          </Heading>
          <OakGrid>
            <OakGridArea $colSpan={[12, 12, 7]}>
              <Heading tag="h2" $font={["heading-6", "heading-5"]} $mb={24}>
                Choose your download
              </Heading>
              <FieldError id={"downloads-error"} withoutMarginBottom>
                {form.errors?.resources?.message}
              </FieldError>
              <CardsContainer data-testid="downloadCardsContainer">
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
                      data-testid={`downloadCard`}
                      useRadio={true}
                      subjectIcon={download.icon}
                    />
                  ))}
                </RadioGroup>
              </CardsContainer>
            </OakGridArea>
            <OakGridArea $colSpan={[12, 12, 5]}>
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
                <P $mb={16}>Loading...</P>
              ) : (
                <Flex $flexDirection="column" $gap={24} $mb={16}>
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
                          privacy policy
                          <Icon
                            name="external"
                            verticalAlign="bottom"
                            size={20}
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
                </Flex>
              )}
              {hasFormErrors && (
                <Flex $flexDirection={"row"} $mb={16}>
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
                onClick={(event) => void form.handleSubmit(onFormSubmit)(event)}
                text={"Download PDF"}
                icon={"download"}
                isLoading={isAttemptingDownload}
                disabled={
                  hasFormErrors ||
                  (!form.formState.isValid && !localStorageDetails)
                }
                loadingText={"Downloading..."}
                data-testid="downloadButton"
              />

              {apiError && !hasFormErrors && (
                <FieldError
                  id="download-error"
                  data-testid="downloadError"
                  variant={"large"}
                  withoutMarginBottom
                >
                  {apiError}
                </FieldError>
              )}
            </OakGridArea>
          </OakGrid>
        </Flex>
      </Box>
    </Box>
  );
}

export default forwardRef(CurriculumDownloads);
