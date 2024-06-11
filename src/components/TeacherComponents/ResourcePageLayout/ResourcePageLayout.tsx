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
} from "@oaknational/oak-components";

import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import NoResourcesToDownload from "@/components/TeacherComponents/NoResourcesToDownload";
import { ResourcePageDetailsCompletedProps } from "@/components/TeacherComponents/ResourcePageDetailsCompleted/ResourcePageDetailsCompleted";
import { ResourcePageSchoolDetailsProps } from "@/components/TeacherComponents/ResourcePageSchoolDetails/ResourcePageSchoolDetails";
import { getFormErrorMessages } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadFormErrorMessage";
import TermsAgreementForm from "@/components/TeacherComponents/TermsAgreementForm";
import NoResourcesToShare from "@/components/TeacherComponents/NoResourcesToShare";
import FieldError from "@/components/SharedComponents/FieldError";
import Box from "@/components/SharedComponents/Box";
import Checkbox from "@/components/SharedComponents/Checkbox";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Icon from "@/components/SharedComponents/Icon";

/** Generic layout component for Downloads and Share page */

export type ResourcePageLayoutProps = ResourcePageDetailsCompletedProps &
  ResourcePageSchoolDetailsProps & {
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
    resourcesHeader: string;
    triggerForm: UseFormTrigger<ResourceFormProps>;
    apiError?: string | null;
    updatedAt: string;
  };

const ResourcePageLayout: FC<ResourcePageLayoutProps> = (props) => {
  const hasFormErrors = Object.keys(props.errors).length > 0;
  return (
    <Box $width="100%">
      <OakFlex
        $alignItems={"flex-start"}
        $flexDirection={"column"}
        $gap={["all-spacing-6", "all-spacing-7"]}
      >
        <OakHeading tag="h1" $font={["heading-5", "heading-4"]}>
          {props.header}
        </OakHeading>
        <OakFlex
          $justifyContent="space-between"
          $width="100%"
          $flexDirection={["column", "column", "row"]}
          $gap="all-spacing-9"
        >
          <OakBox
            $pa={"inner-padding-none"}
            $ba={"border-solid-none"}
            as={props.page === "download" ? "fieldset" : "box"}
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
            <Flex $flexDirection="column" $gap={24} $width={["100%", 720]}>
              <OakHeading tag="h2" $font={["heading-6", "heading-5"]}>
                {props.resourcesHeader}
              </OakHeading>
              <FieldError id={"downloads-error"} withoutMarginBottom>
                {props.errors?.resources?.message}
              </FieldError>
              {!props.hideSelectAll && (
                <Box $maxWidth="max-content">
                  <Checkbox
                    checked={props.selectAllChecked}
                    onChange={props.handleToggleSelectAll}
                    id="select-all"
                    name="select-all"
                    variant="withLabel"
                    labelText="Select all"
                    labelFontWeight={600}
                  />
                </Box>
              )}
              {props.cardGroup}
            </Flex>
          </OakBox>
          <Flex
            $flexDirection="column"
            $alignSelf="center"
            $gap={16}
            $maxWidth={420}
          >
            {props.showNoResources &&
              (props.page === "download" ? (
                <NoResourcesToDownload />
              ) : (
                <NoResourcesToShare />
              ))}
            {!props.showNoResources && (
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
                {hasFormErrors && (
                  <OakFlex $flexDirection={"row"}>
                    <Icon name="content-guidance" $color={"red"} />
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
          </Flex>
        </OakFlex>
      </OakFlex>
    </Box>
  );
};

export default ResourcePageLayout;
