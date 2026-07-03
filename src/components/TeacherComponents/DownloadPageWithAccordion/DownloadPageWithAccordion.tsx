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

import ComplexCopyrightRestrictionBanner from "../ComplexCopyrightRestrictionBanner/ComplexCopyrightRestrictionBanner";

import { getAccordionText } from "./getAccordionText";

import { ResourcePageDetailsCompletedProps } from "@/components/TeacherComponents/ResourcePageDetailsCompleted/ResourcePageDetailsCompleted";
import { ResourcePageSchoolDetailsProps } from "@/components/TeacherComponents/ResourcePageSchoolDetails/ResourcePageSchoolDetails";
import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { DelayedLoadingSpinner } from "@/components/TeacherComponents/SharePageLayout/SharePageLayout";
import OglCopyrightNotice from "@/components/TeacherComponents/OglCopyrightNotice";
import FieldError from "@/components/SharedComponents/FieldError";
import RiskAssessmentBanner from "@/components/TeacherComponents/RiskAssessmentBanner";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";
import NoResourcesToDownload from "@/components/TeacherComponents/NoResourcesToDownload";
import TermsAgreementForm from "@/components/TeacherComponents/TermsAgreementForm";
import { getFormErrorMessages } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadFormErrorMessage";
import { SHARE_FORM_ERROR_IDS } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/shareDownloadFormErrorIds";
import { VALIDATION_SUMMARY_PREFIX } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/validationSummaryText";
import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { DownloadTypeLabel } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";

type DownloadPageWithAccordionProps = ResourcePageDetailsCompletedProps &
  ResourcePageSchoolDetailsProps & {
    geoRestricted: boolean;
    loginRequired: boolean;
    downloadsRestricted: boolean;
    handleToggleSelectAll: () => void;
    selectAllChecked: boolean;
    errors: FieldErrors<ResourceFormValues>;
    cardGroup: React.ReactNode;
    showLoading: boolean;
    showNoResources: boolean;
    schoolId?: string;
    register: UseFormRegister<ResourceFormValues>;
    control: Control<ResourceFormValues>;
    showPostAlbCopyright: boolean;
    showSavedDetails: boolean;
    cta: React.ReactNode;
    triggerForm: UseFormTrigger<ResourceFormValues>;
    apiError?: string | null;
    copyrightYear: string;
    showTermsAgreement: boolean;
    showRiskAssessmentBanner?: boolean;
    lessonDownloads?: LessonDownloadsPageData["downloads"];
    curriculumDownloads?: DownloadTypeLabel[];
    additionalFiles?: LessonDownloadsPageData["additionalFiles"];
    validationSummaryKey?: number;
  };

export type DownloadWrapperProps = {
  isLoading: boolean;
  showGeoBlocked: boolean;
  lessonSlug: string;
  lessonTitle: string;
  lessonReleaseDate: string | null;
  isLegacy: boolean;
} & DownloadPageWithAccordionProps;

const DownloadPageWithAccordion: FC<DownloadWrapperProps> = (
  props: DownloadWrapperProps,
) => {
  const {
    isLoading,
    showGeoBlocked,
    geoRestricted,
    loginRequired,
    lessonSlug,
    lessonReleaseDate,
    lessonTitle,
    isLegacy,
  } = props;
  return (
    <OakGrid>
      <OakGridArea
        $colStart={[null, null, 4]}
        $colSpan={[12, 12, 6]}
        $flexDirection={"column"}
        $gap={"spacing-48"}
      >
        <OakHeading tag="h1" $font={["heading-5", "heading-4"]}>
          Download
        </OakHeading>
        {isLoading ? (
          <OakBox $minHeight="spacing-480">
            <DelayedLoadingSpinner $delay={300} data-testid="loading" />
          </OakBox>
        ) : (
          <DownloadPageWithAccordionContent {...props} />
        )}
        {!showGeoBlocked && (
          <ComplexCopyrightRestrictionBanner
            isGeorestricted={geoRestricted ?? undefined}
            isLoginRequired={loginRequired ?? undefined}
            componentType="lesson_downloads"
            lessonName={lessonTitle}
            lessonSlug={lessonSlug}
            lessonReleaseDate={lessonReleaseDate}
            isLessonLegacy={isLegacy}
          />
        )}
      </OakGridArea>
    </OakGrid>
  );
};

export const DownloadPageWithAccordionContent = (
  props: Pick<
    DownloadPageWithAccordionProps,
    | "errors"
    | "downloadsRestricted"
    | "showTermsAgreement"
    | "lessonDownloads"
    | "curriculumDownloads"
    | "additionalFiles"
    | "handleToggleSelectAll"
    | "selectAllChecked"
    | "cardGroup"
    | "showRiskAssessmentBanner"
    | "showNoResources"
    | "control"
    | "register"
    | "triggerForm"
    | "showLoading"
    | "email"
    | "schoolId"
    | "school"
    | "setSchool"
    | "showSavedDetails"
    | "onEditClick"
    | "showPostAlbCopyright"
    | "copyrightYear"
    | "loginRequired"
    | "geoRestricted"
    | "cta"
    | "apiError"
    | "validationSummaryKey"
  >,
) => {
  const {
    errors,
    downloadsRestricted,
    showTermsAgreement,
    lessonDownloads,
    curriculumDownloads,
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
    copyrightYear,
    loginRequired,
    geoRestricted,
    cta,
    apiError,
    validationSummaryKey,
  } = props;

  const hasFormErrors = Object.keys(errors).length > 0;
  const validationErrorMessages = getFormErrorMessages(errors);
  const hasValidationSummary = validationErrorMessages.length > 0;
  const showFormErrors = hasFormErrors && !downloadsRestricted;
  const showForm = showTermsAgreement && !downloadsRestricted;
  const hideCallToAction = downloadsRestricted;

  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-48"}>
      <FieldError
        id={SHARE_FORM_ERROR_IDS.resources}
        withoutMarginBottom
        ariaLive="polite"
      >
        {errors?.resources?.message}
      </FieldError>
      <OakDownloadsAccordion
        downloadsText={getAccordionText({
          lessonDownloads,
          additionalFiles,
          curriculumDownloads,
        })}
        handleToggleSelectAll={handleToggleSelectAll}
        selectAllChecked={selectAllChecked}
        id="downloads-accordion"
        initialOpen={!selectAllChecked}
      >
        <OakBox $pa={"spacing-0"} $ba={"border-solid-none"} as={"fieldset"}>
          <OakBox
            as="legend"
            $position="absolute"
            $width="spacing-0"
            $height="spacing-0"
            $pa={"spacing-0"}
            $overflow="hidden"
          >
            Select resources to download
          </OakBox>
          {cardGroup}
          {showRiskAssessmentBanner && (
            <OakBox $mv="spacing-16">
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
                oglCopyrightYear={copyrightYear}
                useDownloadPageLayout
              />
              {showRiskAssessmentBanner && (
                <OakBox $display={["block", "block", "none"]} $mv="spacing-16">
                  <RiskAssessmentBanner />
                </OakBox>
              )}
            </>
          )}
          <OakFlex
            key={validationSummaryKey}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-testid="download-validation-summary"
            $flexDirection={"column"}
          >
            {showFormErrors && hasValidationSummary && (
              <OakFlex $flexDirection={"row"}>
                <OakIcon
                  iconName="content-guidance"
                  $colorFilter={"icon-error"}
                  $width={"spacing-24"}
                  $height={"spacing-24"}
                />
                <OakFlex $flexDirection={"column"}>
                  <OakP $ml="spacing-4" $color={"text-error"}>
                    {VALIDATION_SUMMARY_PREFIX}
                  </OakP>
                  <OakUL $mr="spacing-24">
                    {validationErrorMessages.map((err) => {
                      return (
                        <OakLI $color={"text-error"} key={err}>
                          {err}
                        </OakLI>
                      );
                    })}
                  </OakUL>
                </OakFlex>
              </OakFlex>
            )}
          </OakFlex>
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
          <OglCopyrightNotice
            fullWidth
            showPostAlbCopyright={showPostAlbCopyright}
            openLinksExternally={true}
            copyrightYear={copyrightYear}
          />
        </>
      )}
    </OakFlex>
  );
};

export default DownloadPageWithAccordion;
