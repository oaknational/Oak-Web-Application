import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakUL,
  OakLI,
  OakP,
  OakBox,
  OakIcon,
} from "@oaknational/oak-components";

import useAnalytics from "@/context/Analytics/useAnalytics";
import getFormattedDetailsForTracking from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import { getFormErrorMessages } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadFormErrorMessage";
import {
  ResourceFormProps,
  ResourceFormWithRiskAssessmentProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import FieldError from "@/components/SharedComponents/FieldError";
import ResourceCard from "@/components/TeacherComponents/ResourceCard";
import useLocalStorageForDownloads from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import RadioGroup from "@/components/SharedComponents/RadioButtons/RadioGroup";
import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import TermsAgreementForm from "@/components/TeacherComponents/TermsAgreementForm";
import { DownloadCategory } from "@/node-lib/curriculum-api-2023/fixtures/curriculumPreviousDownloads.fixture";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

export type CurriculumDownload = {
  label: string;
  url: string;
  icon: string;
};

export type CurriculumDownloadsRef = {
  clearSelection: () => void;
};

type CurriculumDownloadsProps = {
  category: DownloadCategory;
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

    const downloadCategoryAsKeyStageTitle = (input: DownloadCategory) => {
      const obj: Record<DownloadCategory, KeyStageTitleValueType> = {
        EYFS: "Early Years Foundation stage",
        KS1: "Key stage 1",
        KS2: "Key stage 2",
        KS3: "Key stage 3",
        KS4: "Key stage 4",
        Therapies: "Therapies",
        Specialist: "Specialist",
      };
      return obj[input];
    };

    track.curriculumResourcesDownloaded({
      keyStageTitle: downloadCategoryAsKeyStageTitle(category),
      subjectTitle: selectedDownload
        ? selectedDownload.label
        : "None Specified",
      resourceType: selectedResourcesForTracking,
      analyticsUseCase,
      schoolUrn,
      schoolName,
      schoolOption,
      emailSupplied: !!email,
    });
  };

  // Simplified onFormSubmit using helper functions
  const onFormSubmit = async (
    data: ResourceFormProps | ResourceFormWithRiskAssessmentProps,
  ) => {
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

  useEffect(() => {
    if (hasSetPreselectedDownload) {
      return;
    }
    const subject = router.query.subject as string;
    if (subject) {
      const selectedDownload = downloads.find((download) =>
        download.url.endsWith(subject),
      );
      if (selectedDownload && category.toLowerCase() == router.query.keystage) {
        setHasSetPreselectedDownload(true);
        setSelectedUrl(selectedDownload.url);
        form.setValue("resources", [selectedDownload.url]);
      }
    }
  }, [
    downloads,
    router.query.subject,
    hasSetPreselectedDownload,
    form,
    category,
    router.query.keystage,
  ]);

  return (
    <OakBox
      $maxWidth="all-spacing-24"
      $mh={"auto"}
      $width={"100%"}
      $ph="inner-padding-xl"
      $pb="inner-padding-xl8"
      $pt="inner-padding-xl2"
    >
      <OakBox $width="100%">
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
                <TermsAgreementForm
                  form={form}
                  email={emailFromLocalStorage}
                  schoolId={schoolIdFromLocalStorage}
                  schoolName={schoolNameFromLocalStorage}
                  isLoading={isLocalStorageLoading}
                  setSchool={setSchool}
                  showSavedDetails={shouldDisplayDetailsCompleted}
                  //copyrightYear value hard coded
                  copyrightYear="2023"
                  handleEditDetailsCompletedClick={
                    handleEditDetailsCompletedClick
                  }
                  showRiskAssessmentCheckbox={false}
                />
                {hasFormErrors && (
                  <OakFlex $flexDirection={"row"} $mb={"space-between-s"}>
                    <OakIcon
                      iconName="content-guidance"
                      $colorFilter={"red"}
                      $width={"all-spacing-6"}
                      $height={"all-spacing-6"}
                    />
                    <OakFlex $flexDirection={"column"}>
                      <OakP $ml={"space-between-sssx"} $color={"red"}>
                        To complete correct the following:
                      </OakP>
                      <OakUL $mr={"space-between-m"} data-testid="errorList">
                        {getFormErrorMessages(form.errors).map((err, i) => {
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
                <OakBox $mt={"space-between-s"}>
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
                </OakBox>
              </OakGridArea>
            </OakGrid>
          </form>
        </OakFlex>
      </OakBox>
    </OakBox>
  );
}

export default forwardRef(CurriculumDownloads);
