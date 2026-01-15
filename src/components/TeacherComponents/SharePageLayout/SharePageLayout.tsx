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
} from "@oaknational/oak-components";
import styled from "styled-components";

import CopyrightNotice from "../OglCopyrightNotice";

import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { ResourcePageDetailsCompletedProps } from "@/components/TeacherComponents/ResourcePageDetailsCompleted/ResourcePageDetailsCompleted";
import { ResourcePageSchoolDetailsProps } from "@/components/TeacherComponents/ResourcePageSchoolDetails/ResourcePageSchoolDetails";
import { getFormErrorMessages } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadFormErrorMessage";
import TermsAgreementForm from "@/components/TeacherComponents/TermsAgreementForm";
import NoResourcesToShare from "@/components/TeacherComponents/NoResourcesToShare";
import FieldError from "@/components/SharedComponents/FieldError";

export type SharePageLayoutProps = ResourcePageDetailsCompletedProps &
  ResourcePageSchoolDetailsProps & {
    header: string;
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
  };

const SharePageLayout: FC<SharePageLayoutProps> = (props) => {
  const hasFormErrors = Object.keys(props.errors).length > 0;
  return (
    <OakBox $width="100%">
      <OakFlex
        $alignItems={"flex-start"}
        $flexDirection={"column"}
        $gap={["spacing-24", "spacing-32"]}
      >
        <OakHeading tag="h1" $font={["heading-5", "heading-4"]}>
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
            $flexDirection={["column", "column", "row"]}
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
              <FieldError id={"downloads-error"} withoutMarginBottom>
                {props.errors?.resources?.message}
              </FieldError>
              {props.cardGroup}
            </OakFlex>

            <OakFlex
              $flexDirection="column"
              $gap="spacing-16"
              $maxWidth="spacing-480"
              $position={"sticky"}
              $top={"spacing-56"}
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
                  {hasFormErrors && (
                    <OakFlex $flexDirection={"row"}>
                      <OakIcon
                        iconName="content-guidance"
                        $colorFilter={"red"}
                        $width={"spacing-24"}
                        $height={"spacing-24"}
                      />
                      <OakFlex $flexDirection={"column"}>
                        <OakP $ml="spacing-4" $color={"text-error"}>
                          To complete correct the following:
                        </OakP>
                        <OakUL $mr="spacing-24">
                          {getFormErrorMessages(props.errors).map((err) => {
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

                  {!props.showTermsAgreement && (
                    <OakBox
                      $pb={"spacing-16"}
                      $mt={"spacing-24"}
                      $maxWidth={"spacing-640"}
                      data-testid="copyright-container"
                    >
                      <CopyrightNotice
                        fullWidth
                        showPostAlbCopyright={props.showPostAlbCopyright}
                        openLinksExternally={true}
                        copyrightYear={props.updatedAt}
                      />
                    </OakBox>
                  )}

                  {props.cta}

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
