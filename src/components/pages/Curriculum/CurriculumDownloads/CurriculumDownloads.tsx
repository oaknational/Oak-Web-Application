import { ChangeEvent, useState } from "react";
import { Controller } from "react-hook-form";

import Box from "@/components/Box";
import useAnalytics from "@/context/Analytics/useAnalytics";
import getFormattedDetailsForTracking from "@/components/DownloadAndShareComponents/helpers/getFormattedDetailsForTracking";
import getDownloadFormErrorMessage from "@/components/DownloadAndShareComponents/helpers/getDownloadFormErrorMessage";
import useResourceFormSubmit from "@/components/DownloadAndShareComponents/hooks/useResourceFormSubmit";
import {
  ErrorKeysType,
  ResourceFormProps,
} from "@/components/DownloadAndShareComponents/downloadAndShare.types";
import DownloadCardGroup from "@/components/DownloadAndShareComponents/DownloadCardGroup/DownloadCardGroup";
import debouncedSubmit from "@/components/DownloadAndShareComponents/helpers/downloadDebounceSubmit";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import LoadingButton from "@/components/Button/LoadingButton";
import { useResourceFormState } from "@/components/DownloadAndShareComponents/hooks/useResourceFormState";
import Checkbox from "@/components/Checkbox";
import CopyrightNotice from "@/components/DownloadAndShareComponents/CopyrightNotice";
import DetailsCompleted from "@/components/DownloadAndShareComponents/DetailsCompleted";
import SchoolDetails from "@/components/DownloadAndShareComponents/SchoolDetails";
import TermsAndConditionsCheckbox from "@/components/DownloadAndShareComponents/TermsAndConditionsCheckbox";
import Flex from "@/components/Flex";
import FieldError from "@/components/FormFields/FieldError";
import Grid, { GridArea } from "@/components/Grid";
import Icon from "@/components/Icon";
import OakLink from "@/components/OakLink";
import { Heading, P, UL, LI } from "@/components/Typography";
import Input from "@/components/Input";

type CurriculumDownloadsProps = {
  category: string;
  downloads: {
    exists: true;
    type: "curriculum-pdf";
    label: string;
    ext: "pdf";
  }[];
};

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
    setEmailInLocalStorage,
  } = useResourceFormState({ downloadResources: downloads, type: "download" });

  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);

  const [apiError, setApiError] = useState<string | null>(null);

  const { onSubmit } = useResourceFormSubmit({
    isLegacyDownload: true,
    type: "download",
  });

  const [isDownloadSuccessful, setIsDownloadSuccessful] =
    useState<boolean>(false);

  const onFormSubmit = async (data: ResourceFormProps): Promise<void> => {
    setApiError(null);
    try {
      await debouncedSubmit({
        data,
        lessonSlug: "",
        setIsAttemptingDownload,
        setEditDetailsClicked,
        onSubmit,
      });
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
        category: "KS3", // TODO: replace with "keyStage" once we have the correct value
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
                <DownloadCardGroup
                  control={form.control}
                  downloads={downloads}
                  hasError={form.errors?.resources ? true : false}
                  triggerForm={form.trigger}
                />
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
                        {getFormErrorMessages().map((err) => {
                          return <LI $color={"red"}>{err}</LI>;
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
