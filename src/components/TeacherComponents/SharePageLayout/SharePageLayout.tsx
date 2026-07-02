import { FC } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";
import {
  OakHeading,
  OakLI,
  OakP,
  OakUL,
  OakFlex,
  OakBox,
  OakLoadingSpinner,
  OakIcon,
  OakHandDrawnHR,
} from "@oaknational/oak-components";
import styled from "styled-components";

import CopyrightNotice from "../OglCopyrightNotice";

import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { ResourcePageDetailsCompletedProps } from "@/components/TeacherComponents/ResourcePageDetailsCompleted/ResourcePageDetailsCompleted";
import { ResourcePageSchoolDetailsProps } from "@/components/TeacherComponents/ResourcePageSchoolDetails/ResourcePageSchoolDetails";
import { getFormErrorMessages } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadFormErrorMessage";
import { SHARE_FORM_ERROR_IDS } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/shareDownloadFormErrorIds";
import TermsAgreementForm from "@/components/TeacherComponents/TermsAgreementForm";
import NoResourcesToShare from "@/components/TeacherComponents/NoResourcesToShare";
import FieldError from "@/components/SharedComponents/FieldError";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";

export type SharePageLayoutProps = ResourcePageDetailsCompletedProps &
  ResourcePageSchoolDetailsProps & {
    header: string;
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
    updatedAt: string;
    showTermsAgreement: boolean;
    isLoading: boolean;
    validationSummaryKey?: number;
  };

const SharePageLayout: FC<SharePageLayoutProps> = (props) => {
  const hasFormErrors = Object.keys(props.errors).length > 0;
  const validationErrorMessages = getFormErrorMessages(props.errors);
  const hasValidationSummary = validationErrorMessages.length > 0;
  const validationSummaryAnnouncement = `To complete, correct the following: ${validationErrorMessages.join(". ")}`;
  return (
    <OakBox $maxWidth={"spacing-960"} $mb={"spacing-48"}>
      <OakFlex
        $alignItems={"flex-start"}
        $flexDirection={"column"}
        $gap={["spacing-24", "spacing-32"]}
      >
        <OakHeading tag="h1" $font={"heading-4"}>
          {props.header}
        </OakHeading>
        {props.isLoading ? (
          <OakBox $minHeight="spacing-480">
            <DelayedLoadingSpinner $delay={300} data-testid="loading" />
          </OakBox>
        ) : (
          <OakFlex
            $justifyContent="space-between"
            $width="100%"
            $flexDirection={"column"}
            $gap="spacing-48"
            $alignItems={"flex-start"}
            $position={"relative"}
          >
            <OakFlex
              $pa={"spacing-0"}
              $ba={"border-solid-none"}
              $flexDirection="column"
              $gap={"spacing-16"}
              $width={"100%"}
            >
              <FieldError
                id={SHARE_FORM_ERROR_IDS.resources}
                withoutMarginBottom
              >
                {props.errors?.resources?.message}
              </FieldError>
              {props.cardGroup}
            </OakFlex>

            <OakFlex
              $flexDirection="column"
              $gap="spacing-16"
              $position={"sticky"}
              $top={"spacing-56"}
              $width={"100%"}
            >
              {props.showNoResources ? (
                <NoResourcesToShare />
              ) : (
                <>
                  {props.showTermsAgreement && (
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
                      oglCopyrightYear={props.updatedAt}
                    />
                  )}
                  {hasValidationSummary && (
                    <OakFlex
                      role="alert"
                      aria-atomic="true"
                      data-testid="share-validation-summary"
                      key={props.validationSummaryKey}
                      $flexDirection={"column"}
                    >
                      <OakFlex aria-hidden={true} $flexDirection={"row"}>
                        <OakIcon
                          iconName="content-guidance"
                          $colorFilter={"icon-error"}
                          $width={"spacing-24"}
                          $height={"spacing-24"}
                        />
                        <OakFlex $flexDirection={"column"}>
                          <OakP $ml="spacing-4" $color={"text-error"}>
                            To complete, correct the following:
                          </OakP>
                          <OakUL $mr="spacing-24">
                            {validationErrorMessages.map((err) => (
                              <OakLI $color={"text-error"} key={err}>
                                {err}
                              </OakLI>
                            ))}
                          </OakUL>
                        </OakFlex>
                      </OakFlex>
                      <ScreenReaderOnly data-testid="share-validation-summary-sr">
                        {validationSummaryAnnouncement}
                      </ScreenReaderOnly>
                    </OakFlex>
                  )}

                  {!props.showTermsAgreement && (
                    <OakBox
                      $pb={"spacing-16"}
                      $mt={"spacing-24"}
                      $maxWidth={"spacing-640"}
                      data-testid="copyright-container"
                      $display={"none"}
                    >
                      <CopyrightNotice
                        fullWidth
                        showPostAlbCopyright={props.showPostAlbCopyright}
                        openLinksExternally={true}
                        copyrightYear={props.updatedAt}
                      />
                    </OakBox>
                  )}
                  <OakHandDrawnHR
                    aria-hidden
                    data-testid="share-decorative-separator"
                    $height={"spacing-2"}
                    $width={"100%"}
                    $mb={"spacing-16"}
                    $mt={"spacing-16"}
                    hrColor={"border-neutral-lighter"}
                  />

                  {props.cta}

                  <CopyrightNotice
                    fullWidth
                    showPostAlbCopyright={true}
                    openLinksExternally={true}
                    copyrightYear={props.updatedAt}
                  />

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
                </>
              )}
            </OakFlex>
          </OakFlex>
        )}
      </OakFlex>
    </OakBox>
  );
};

export default SharePageLayout;

export const DelayedLoadingSpinner = styled(OakLoadingSpinner)<{
  $delay?: number;
}>`
  ${({ $delay }) => {
    if ($delay) {
      return `
        opacity: 0;
        animation: delayed-spinner-show 0s;
        animation-delay: ${$delay / 1000}s;
        animation-fill-mode: forwards;
      `;
    }
  }}

  @keyframes delayed-spinner-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
