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

import CopyrightNotice from "../CopyrightNotice";

import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import NoResourcesToDownload from "@/components/TeacherComponents/NoResourcesToDownload";
import { ResourcePageDetailsCompletedProps } from "@/components/TeacherComponents/ResourcePageDetailsCompleted/ResourcePageDetailsCompleted";
import { ResourcePageSchoolDetailsProps } from "@/components/TeacherComponents/ResourcePageSchoolDetails/ResourcePageSchoolDetails";
import { getFormErrorMessages } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadFormErrorMessage";
import TermsAgreementForm from "@/components/TeacherComponents/TermsAgreementForm";
import NoResourcesToShare from "@/components/TeacherComponents/NoResourcesToShare";
import FieldError from "@/components/SharedComponents/FieldError";
import Checkbox from "@/components/SharedComponents/Checkbox";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import RiskAssessmentBanner from "@/components/TeacherComponents/RiskAssessmentBanner";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";

/** Generic layout component for Downloads and Share page */

export type ResourcePageLayoutProps = ResourcePageDetailsCompletedProps &
  ResourcePageSchoolDetailsProps & {
    downloadsRestricted: boolean;
    header: string;
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
    page: "share" | "download";
    resourcesHeader?: string;
    triggerForm: UseFormTrigger<ResourceFormProps>;
    apiError?: string | null;
    updatedAt: string;
    showTermsAgreement: boolean;
    isLoading: boolean;
    showRiskAssessmentBanner?: boolean;
  };

const ResourcePageLayout: FC<ResourcePageLayoutProps> = (props) => {
  return (
    <OakBox $width="100%">
      <OakFlex
        $alignItems={"flex-start"}
        $flexDirection={"column"}
        $gap={["all-spacing-6", "all-spacing-7"]}
      >
        <OakHeading tag="h1" $font={["heading-5", "heading-4"]}>
          {props.header}
        </OakHeading>
        {props.isLoading ? (
          <OakBox $minHeight="all-spacing-21">
            <DelayedLoadingSpinner $delay={300} data-testid="loading" />
          </OakBox>
        ) : (
          <ResourcePageContent {...props} />
        )}
      </OakFlex>
    </OakBox>
  );
};

export default ResourcePageLayout;

function ResourcePageContent(props: ResourcePageLayoutProps) {
  const hasFormErrors = Object.keys(props.errors).length > 0;
  const showFormErrors = hasFormErrors && !props.downloadsRestricted;
  const showForm = props.showTermsAgreement && !props.downloadsRestricted;
  const hideCallToAction = props.downloadsRestricted;
  return (
    <OakFlex
      $justifyContent="space-between"
      $width="100%"
      $flexDirection={["column", "column", "row"]}
      $gap="all-spacing-9"
      $alignItems={"flex-start"}
      $position={"relative"}
    >
      <OakBox
        $pa={"inner-padding-none"}
        $ba={"border-solid-none"}
        as={props.page === "download" ? "fieldset" : "div"}
      >
        {props.page === "download" && (
          <OakBox
            as="legend"
            $position="absolute"
            $width="all-spacing-0"
            $height="all-spacing-0"
            $pa={"inner-padding-none"}
            $overflow="hidden"
          >
            {`Select resources to ${props.page}`}
          </OakBox>
        )}
        <Flex $flexDirection="column" $gap={16} $width={["100%", 720]}>
          {props.resourcesHeader && (
            <OakHeading
              tag="h2"
              $font={["heading-6", "heading-5"]}
              $mb={"space-between-ssx"}
            >
              {props.resourcesHeader}
            </OakHeading>
          )}
          <FieldError id={"downloads-error"} withoutMarginBottom>
            {props.errors?.resources?.message}
          </FieldError>
          {!props.hideSelectAll && (
            <OakBox $maxWidth="max-content">
              <Checkbox
                checked={props.selectAllChecked}
                onChange={props.handleToggleSelectAll}
                id="select-all"
                name="select-all"
                variant="withLabel"
                labelText="Select all"
                labelFontWeight={600}
              />
            </OakBox>
          )}
          {props.cardGroup}
          {props.showRiskAssessmentBanner && (
            <>
              {props.showTermsAgreement ? (
                <OakBox $display={["none", "none", "block"]}>
                  <RiskAssessmentBanner />
                </OakBox>
              ) : (
                <OakBox $mv="space-between-s">
                  <RiskAssessmentBanner />
                </OakBox>
              )}
            </>
          )}
          {props.downloadsRestricted && (
            <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
              <OakBox
                $pb={"inner-padding-xl3"}
                $mt={"space-between-m"}
                $maxWidth={"all-spacing-22"}
              >
                <CopyrightNotice
                  fullWidth
                  showPostAlbCopyright={props.showPostAlbCopyright}
                  openLinksExternally={true}
                  copyrightYear={props.updatedAt}
                />
              </OakBox>
              <LoginRequiredButton
                signUpProps={{ name: "Sign in to continue" }}
                iconName="arrow-right"
                isTrailingIcon
              />
            </OakFlex>
          )}
        </Flex>
      </OakBox>

      <OakFlex
        $flexDirection="column"
        $gap="space-between-s"
        $maxWidth="all-spacing-21"
        $position={"sticky"}
        $top={"all-spacing-10"}
      >
        {props.showNoResources &&
          (props.page === "download" ? (
            <NoResourcesToDownload />
          ) : (
            <NoResourcesToShare />
          ))}
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

            {!props.showTermsAgreement && (
              <OakBox
                $pb={"inner-padding-m"}
                $mt={"space-between-m"}
                $maxWidth={"all-spacing-22"}
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

            {!hideCallToAction && props.cta}

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
  );
}

const DelayedLoadingSpinner = styled(OakLoadingSpinner)<{ $delay?: number }>`
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
