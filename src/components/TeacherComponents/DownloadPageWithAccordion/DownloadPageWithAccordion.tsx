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

import CopyrightRestrictionBanner from "../CopyrightRestrictionBanner/CopyrightRestrictionBanner";

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

export type DownloadPageWithAccordionProps = ResourcePageDetailsCompletedProps &
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
    showGeoBlocked: boolean;
    lessonSlug: string;
    lessonTitle: string;
    lessonReleaseDate: string | null;
    isLegacy: boolean;
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

const DownloadPageWithAccordion: FC<DownloadPageWithAccordionProps> = (
  props: DownloadPageWithAccordionProps,
) => {
  return (
    <OakGrid>
      <OakGridArea
        $colStart={[null, null, 4]}
        $colSpan={[12, 12, 6]}
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
        {!props.showGeoBlocked && (
          <CopyrightRestrictionBanner
            isGeorestricted={props.geoRestricted ?? undefined}
            isLoginRequired={props.loginRequired ?? undefined}
            componentType="lesson_downloads"
            lessonName={props.lessonTitle}
            lessonSlug={props.lessonSlug}
            lessonReleaseDate={props.lessonReleaseDate}
            isLessonLegacy={props.isLegacy}
          />
        )}
      </OakGridArea>
    </OakGrid>
  );
};

const DownloadPageWithAccordionContent = (
  props: DownloadPageWithAccordionProps,
) => {
  const {
    errors,
    downloadsRestricted,
    showTermsAgreement,
    downloads,
    additionalFiles,
    handleToggleSelectAll,
    selectAllChecked,
    cardGroup,
    showRiskAssessmentBanner,
    showNoResources,
    control,
    register,
    triggerForm,
    showLoading,
    email,
    schoolId,
    school,
    setSchool,
    showSavedDetails,
    onEditClick,
    showPostAlbCopyright,
    updatedAt,
    loginRequired,
    geoRestricted,
    cta,
    apiError,
  } = props;

  const hasFormErrors = Object.keys(errors).length > 0;
  const showFormErrors = hasFormErrors && !downloadsRestricted;
  const showForm = showTermsAgreement && !downloadsRestricted;
  const hideCallToAction = downloadsRestricted;

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-l"}>
      <FieldError id={"downloads-error"} withoutMarginBottom>
        {errors?.resources?.message}
      </FieldError>
      <OakDownloadsAccordion
        downloadsText={getAccordionText(downloads ?? [], additionalFiles ?? [])}
        handleToggleSelectAll={handleToggleSelectAll}
        selectAllChecked={selectAllChecked}
        id="downloads-accordion"
        initialOpen={!selectAllChecked}
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
          {cardGroup}
          {showRiskAssessmentBanner && (
            <OakBox $mv="space-between-s">
              <RiskAssessmentBanner />
            </OakBox>
          )}
        </OakBox>
      </OakDownloadsAccordion>

      {showNoResources ? (
        <NoResourcesToDownload />
      ) : (
        <>
          {showForm && (
            <>
              <TermsAgreementForm
                form={{
                  control: control,
                  register: register,
                  errors: errors,
                  trigger: triggerForm,
                }}
                isLoading={showLoading}
                email={email}
                schoolId={schoolId}
                schoolName={school}
                setSchool={setSchool}
                showSavedDetails={showSavedDetails}
                handleEditDetailsCompletedClick={onEditClick}
                showPostAlbCopyright={showPostAlbCopyright}
                copyrightYear={updatedAt}
                isDownloadsExperiment
              />
              {showRiskAssessmentBanner && (
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
                  {getFormErrorMessages(errors).map((err) => {
                    return (
                      <OakLI $color={"red"} key={err}>
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
              loginRequired={loginRequired ?? false}
              geoRestricted={geoRestricted ?? false}
              signUpProps={{ name: "Sign in to continue" }}
              iconName="arrow-right"
              isTrailingIcon
            />
          ) : (
            cta
          )}
          {apiError && !hasFormErrors && (
            <FieldError
              id="download-error"
              data-testid="download-error"
              variant={"large"}
              withoutMarginBottom
              ariaLive="polite"
            >
              {apiError}
            </FieldError>
          )}
          <CopyrightNotice
            fullWidth
            showPostAlbCopyright={showPostAlbCopyright}
            openLinksExternally={true}
            copyrightYear={updatedAt}
          />
        </>
      )}
    </OakFlex>
  );
};

export default DownloadPageWithAccordion;
