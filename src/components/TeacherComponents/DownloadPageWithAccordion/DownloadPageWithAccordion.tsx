import { FC } from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakIcon,
  OakP,
  OakUL,
  OakLI,
  OakGrid,
  OakGridArea,
  OakDownloadsAccordion,
} from "@oaknational/oak-components";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";

import { ResourcePageDetailsCompletedProps } from "@/components/TeacherComponents/ResourcePageDetailsCompleted/ResourcePageDetailsCompleted";
import { ResourcePageSchoolDetailsProps } from "@/components/TeacherComponents/ResourcePageSchoolDetails/ResourcePageSchoolDetails";
import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { DelayedLoadingSpinner } from "@/components/TeacherComponents/ResourcePageLayout/ResourcePageLayout";
import CopyrightNotice from "@/components/TeacherComponents/CopyrightNotice";
import FieldError from "@/components/SharedComponents/FieldError";
import RiskAssessmentBanner from "@/components/TeacherComponents/RiskAssessmentBanner";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";
import NoResourcesToDownload from "@/components/TeacherComponents/NoResourcesToDownload";
import TermsAgreementForm from "@/components/TeacherComponents/TermsAgreementForm";
import { getFormErrorMessages } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadFormErrorMessage";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

type DownloadPageWithAccordionProps = ResourcePageDetailsCompletedProps &
  ResourcePageSchoolDetailsProps & {
    geoRestricted: boolean;
    loginRequired: boolean;
    downloadsRestricted: boolean;
    handleToggleSelectAll: () => void;
    selectAllChecked: boolean;
    errors: FieldErrors<ResourceFormProps>;
    cardGroup: React.ReactNode;
    showLoading: boolean;
    showNoResources: boolean;
    hideSelectAll?: boolean;
    schoolId?: string;
    register: UseFormRegister<ResourceFormProps>;
    control: Control<ResourceFormProps>;
    showPostAlbCopyright: boolean;
    showSavedDetails: boolean;
    cta: React.ReactNode;
    triggerForm: UseFormTrigger<ResourceFormProps>;
    apiError?: string | null;
    updatedAt: string;
    showTermsAgreement: boolean;
    isLoading: boolean;
    showRiskAssessmentBanner?: boolean;
    downloads?: LessonDownloadsPageData["downloads"];
    additionalFiles?: LessonDownloadsPageData["additionalFiles"];
  };

const getAccordionText = (
  downloads: LessonDownloadsPageData["downloads"],
  additionalFiles: LessonDownloadsPageData["additionalFiles"],
) => {
  const resources = [];
  const resourceTypes: Record<string, string> = {
    presentation: "slides",
    "intro-quiz-questions": "quizzes",
    "intro-quiz-answers": "quizzes",
    "exit-quiz-questions": "quizzes",
    "exit-quiz-answers": "quizzes",
    "worksheet-pdf": "worksheets",
    "worksheet-pptx": "worksheets",
    "supplementary-pdf": "additional materials",
    "supplementary-docx": "additional materials",
    "lesson-guide-pdf": "lesson guide",
    "additional-files": "additional files",
  };

  for (const download of downloads as Array<{ type?: string }>) {
    if (download.type && download.type in resourceTypes) {
      resources.push(resourceTypes[download.type]);
    }
  }
  if (additionalFiles && additionalFiles.length > 0) {
    resources.push("additional files");
  }
  const resourcesText = Array.from(new Set(resources)).join(", ");

  return resourcesText.charAt(0).toUpperCase() + resourcesText.slice(1);
};

// TODO: Rename component if experiment is successful
const DownloadPageWithAccordion: FC<DownloadPageWithAccordionProps> = (
  props: DownloadPageWithAccordionProps,
) => {
  return (
    <OakGrid>
      <OakGridArea
        $colStart={4}
        $colSpan={6}
        $flexDirection={"column"}
        $gap={"space-between-l"}
      >
        <OakHeading tag="h1" $font={["heading-5", "heading-4"]}>
          Download
        </OakHeading>
        {props.isLoading ? (
          <OakBox $minHeight="all-spacing-21">
            <DelayedLoadingSpinner $delay={300} data-testid="loading" />
          </OakBox>
        ) : (
          <DownloadPageWithAccordionContent {...props} />
        )}
      </OakGridArea>
    </OakGrid>
  );
};

const DownloadPageWithAccordionContent = (
  props: DownloadPageWithAccordionProps,
) => {
  const hasFormErrors = Object.keys(props.errors).length > 0;
  const showFormErrors = hasFormErrors && !props.downloadsRestricted;
  const showForm = props.showTermsAgreement && !props.downloadsRestricted;
  const hideCallToAction = props.downloadsRestricted;

  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"space-between-l"}
      $maxWidth={"all-spacing-22"}
    >
      <FieldError id={"downloads-error"} withoutMarginBottom>
        {props.errors?.resources?.message}
      </FieldError>
      <OakDownloadsAccordion
        downloadsText={getAccordionText(
          props.downloads ?? [],
          props.additionalFiles ?? [],
        )}
        handleToggleSelectAll={props.handleToggleSelectAll}
        selectAllChecked={props.selectAllChecked}
        id="downloads-accordion"
      >
        <OakBox
          $pa={"inner-padding-none"}
          $ba={"border-solid-none"}
          as={"fieldset"}
        >
          <OakBox
            as="legend"
            $position="absolute"
            $width="all-spacing-0"
            $height="all-spacing-0"
            $pa={"inner-padding-none"}
            $overflow="hidden"
          >
            Select resources to download
          </OakBox>
          {props.cardGroup}
          {props.showRiskAssessmentBanner && (
            <OakBox $mv="space-between-s">
              <RiskAssessmentBanner />
            </OakBox>
          )}
        </OakBox>
      </OakDownloadsAccordion>

      {props.showNoResources && <NoResourcesToDownload />}
      {!props.showNoResources && (
        <>
          {showForm && (
            <>
              <TermsAgreementForm
                form={{
                  control: props.control,
                  register: props.register,
                  errors: props.errors,
                  trigger: props.triggerForm,
                }}
                isLoading={props.showLoading}
                email={props.email}
                schoolId={props.schoolId}
                schoolName={props.school}
                setSchool={props.setSchool}
                showSavedDetails={props.showSavedDetails}
                handleEditDetailsCompletedClick={props.onEditClick}
                showPostAlbCopyright={props.showPostAlbCopyright}
                copyrightYear={props.updatedAt}
                isDownloadPageExperiment
              />
              {props.showRiskAssessmentBanner && (
                <OakBox
                  $display={["block", "block", "none"]}
                  $mv="space-between-s"
                >
                  <RiskAssessmentBanner />
                </OakBox>
              )}
            </>
          )}
          {showFormErrors && (
            <OakFlex $flexDirection={"row"}>
              <OakIcon
                iconName="content-guidance"
                $colorFilter={"red"}
                $width={"all-spacing-6"}
                $height={"all-spacing-6"}
              />
              <OakFlex $flexDirection={"column"}>
                <OakP $ml="space-between-sssx" $color={"red"}>
                  To complete correct the following:
                </OakP>
                <OakUL $mr="space-between-m">
                  {getFormErrorMessages(props.errors).map((err, i) => {
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

          {hideCallToAction ? (
            <LoginRequiredButton
              loginRequired={props.loginRequired ?? false}
              geoRestricted={props.geoRestricted ?? false}
              signUpProps={{ name: "Sign in to continue" }}
              iconName="arrow-right"
              isTrailingIcon
            />
          ) : (
            props.cta
          )}

          {props.apiError && !hasFormErrors && (
            <FieldError
              id="download-error"
              data-testid="download-error"
              variant={"large"}
              withoutMarginBottom
              ariaLive="polite"
            >
              {props.apiError}
            </FieldError>
          )}

          <CopyrightNotice
            fullWidth
            showPostAlbCopyright={props.showPostAlbCopyright}
            openLinksExternally={true}
            copyrightYear={props.updatedAt}
          />
        </>
      )}
    </OakFlex>
  );
};

export default DownloadPageWithAccordion;
