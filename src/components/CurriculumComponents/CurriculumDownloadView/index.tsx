import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { FC, useEffect, useState } from "react";

import { formattedDate } from "../DocxPOC/util";

import Box from "@/components/SharedComponents/Box";
import { CurriculumSelectionSlugs } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import {
  UseResourceFormStateProps,
  useResourceFormState,
} from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import TermsAgreementForm from "@/components/TeacherComponents/TermsAgreementForm";
import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
// import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import useLocalStorageForDownloads from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useLocalStorageForDownloads";
import FieldError from "@/components/SharedComponents/FieldError";
import errorReporter from "@/common-lib/error-reporter";

export type CurriculumDownloadViewProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  cache: number;
  onDownloadComplete: () => void;
};

const resources: UseResourceFormStateProps = {
  type: "curriculumDocx",
  curriculumResourcesFileTypes: ["docx"],
};

const CurriculumDownloadView: FC<CurriculumDownloadViewProps> = ({
  curriculumSelectionSlugs,
  cache,
  onDownloadComplete,
}) => {
  const {
    form,
    emailFromLocalStorage,
    schoolIdFromLocalStorage,
    schoolNameFromLocalStorage,
    isLocalStorageLoading,
    setSchool,
    shouldDisplayDetailsCompleted,
    handleEditDetailsCompletedClick,
    editDetailsClicked,
    hasFormErrors,
    localStorageDetails,
  } = useResourceFormState(resources);

  const [apiError, setApiError] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);
  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);
  // const { onHubspotSubmit } = useHubspotSubmit();
  const reportError = errorReporter("CurriculumDownloadView/index.tsx");

  const { subjectSlug, phaseSlug, examboardSlug } = curriculumSelectionSlugs;
  const slug = [subjectSlug, phaseSlug, "published", examboardSlug].join("/");
  const filename = `${subjectSlug} - ${phaseSlug} - ${examboardSlug} - ${formattedDate(
    new Date(),
  )}.docx`;
  const downloadPath = `/api/curriculum-downloads/${cache}/${slug}`;

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

  const onFormSubmit = async (data: ResourceFormProps) => {
    // console.log(data);
    // await onHubspotSubmit(data);
    setIsAttemptingDownload(true);

    const { email, school, schoolName, terms } = data;
    handleLocalStorageUpdates({
      email,
      school,
      schoolName: schoolName || "", // Ensure schoolName is a string
      terms,
    });

    fetch(downloadPath)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.blob();
        } else {
          throw new Error(`Error: ${resp.status} ${resp.statusText}`);
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        setIsAttemptingDownload(false);
        onDownloadComplete();
      })
      .catch((error) => {
        reportError(
          "There was an error downloading the curriculum docx.",
          error,
        );
        setIsAttemptingDownload(false);
        setApiError(
          "There was an error downloading your files. Please try again.",
        );
      });

    if (editDetailsClicked && !data.email) setEmailInLocalStorage("");
  };

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <OakBox $color="black">
      <OakHeading tag="h2" $font={["heading-4"]} $mb={["space-between-m"]}>
        Download
      </OakHeading>
      <OakGrid>
        <OakGridArea $colSpan={[12, 12, 6]} $pr="inner-padding-xl">
          <OakFlex
            $flexDirection={"column"}
            $gap={"space-between-s"}
            $maxWidth={["all-spacing-22", null, null]}
          >
            <OakHeading
              tag="h3"
              $font={["heading-5"]}
              data-testid="download-heading"
            >
              Document preview
            </OakHeading>
            {/* <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${window.location.origin}${downloadPath}`}
              width="100%"
              style={{ aspectRatio: 210 / 297 }}
              frameBorder="0"
            >
              This is an embedded{" "}
              <a target="_blank" href="http://office.com">
                Microsoft Office
              </a>{" "}
              document, powered by{" "}
              <a target="_blank" href="http://office.com/webapps">
                Office Online
              </a>
              .
            </iframe> */}
            <OakBox
              $position="relative"
              $borderStyle="solid"
              $borderColor="black"
            >
              {origin && (
                <iframe
                  width="100%"
                  frameBorder={0}
                  style={{ aspectRatio: 210 / 297 }}
                  src={`https://docs.google.com/gview?url=${origin}${downloadPath}&embedded=true`}
                />
              )}
            </OakBox>
          </OakFlex>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 12, 6]}>
          <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
            <OakFlex
              $flexDirection={"column"}
              $alignItems={["start", "start", "center"]}
            >
              <Box $maxWidth={[null, 420, 420]}>
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
                />
                <OakFlex
                  $flexDirection={"column"}
                  $width={"100%"}
                  $gap={"space-between-m"}
                  $mv={"space-between-m2"}
                  $alignItems={"start"}
                  $justifyContent={"start"}
                  data-testid="download-options"
                >
                  <OakHeading tag={"h3"} $font={"heading-7"}>
                    Word Document (docx)
                  </OakHeading>
                  <OakPrimaryButton
                    isLoading={isAttemptingDownload}
                    type="submit"
                    disabled={
                      hasFormErrors ||
                      (!form.formState.isValid && !localStorageDetails)
                    }
                    onClick={(event) => {
                      form.handleSubmit(onFormSubmit)(event);
                    }}
                  >
                    Download
                  </OakPrimaryButton>
                  {apiError && !hasFormErrors && (
                    <FieldError
                      id="download-error"
                      variant={"large"}
                      withoutMarginBottom
                    >
                      {apiError}
                    </FieldError>
                  )}
                </OakFlex>
              </Box>
            </OakFlex>
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
};

export default CurriculumDownloadView;
