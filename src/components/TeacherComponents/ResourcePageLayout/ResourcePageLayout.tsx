import { ChangeEvent, FC } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";

import {
  ErrorKeysType,
  ResourceFormProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import NoResourcesToDownload from "@/components/TeacherComponents/NoResourcesToDownload";
import ResourcePageDetailsCompleted from "@/components/TeacherComponents/ResourcePageDetailsCompleted";
import { ResourcePageDetailsCompletedProps } from "@/components/TeacherComponents/ResourcePageDetailsCompleted/ResourcePageDetailsCompleted";
import ResourcePageSchoolDetails from "@/components/TeacherComponents/ResourcePageSchoolDetails";
import { ResourcePageSchoolDetailsProps } from "@/components/TeacherComponents/ResourcePageSchoolDetails/ResourcePageSchoolDetails";
import ResourcePageTermsAndConditionsCheckbox from "@/components/TeacherComponents/ResourcePageTermsAndConditionsCheckbox";
import CopyrightNotice from "@/components/TeacherComponents/CopyrightNotice";
import NoResourcesToShare from "@/components/TeacherComponents/NoResourcesToShare";
import getDownloadFormErrorMessage from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getDownloadFormErrorMessage";
import { Heading, LI, P, UL } from "@/components/SharedComponents/Typography";
import FieldError from "@/components/SharedComponents/FieldError";
import Box from "@/components/SharedComponents/Box";
import Checkbox from "@/components/SharedComponents/Checkbox";
import Flex from "@/components/SharedComponents/Flex";
import Input from "@/components/SharedComponents/Input";
import OwaLink from "@/components/SharedComponents/OwaLink";
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
  };

const ResourcePageLayout: FC<ResourcePageLayoutProps> = (props) => {
  const hasFormErrors = Object.keys(props.errors)?.length > 0;
  const getFormErrorMessages = () => {
    const errorKeyArray = Object.keys(props.errors);

    const errorMessage = getDownloadFormErrorMessage(
      errorKeyArray as ErrorKeysType[],
    );

    return errorMessage;
  };
  return (
    <Box $width="100%">
      <Flex
        $alignItems={"flex-start"}
        $flexDirection={"column"}
        $gap={[24, 32]}
      >
        <Heading tag="h1" $font={["heading-5", "heading-4"]}>
          {props.header}
        </Heading>
        <Flex
          $justifyContent="space-between"
          $width="100%"
          $flexDirection={["column", "column", "row"]}
          $gap={48}
        >
          <Flex $flexDirection="column" $gap={24} $width={["100%", 720]}>
            <Heading tag="h2" $font={["heading-6", "heading-5"]}>
              {props.resourcesHeader}
            </Heading>
            <FieldError id={"downloads-error"} withoutMarginBottom>
              {props.errors?.resources?.message}
            </FieldError>
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
            {props.cardGroup}
          </Flex>
          <Flex
            $flexDirection="column"
            $alignSelf="center"
            $gap={16}
            $maxWidth={420}
          >
            <Heading tag="h2" $font={["heading-6", "heading-5"]} $mb={[24, 32]}>
              Your details
            </Heading>
            {props.errors.school && (
              <FieldError id="school-error">
                {props.errors.school?.message}
              </FieldError>
            )}
            {props.showNoResources ? (
              props.page === "download" ? (
                <NoResourcesToDownload />
              ) : (
                <NoResourcesToShare />
              )
            ) : (
              <>
                {props.showLoading ? (
                  <P $mt={24}>Loading...</P>
                ) : (
                  <Flex $flexDirection="column" $gap={24}>
                    {props.showSavedDetails ? (
                      <ResourcePageDetailsCompleted
                        email={props.email}
                        school={props.school}
                        onEditClick={props.onEditClick}
                      />
                    ) : (
                      <Box $maxWidth={[null, 420, 420]}>
                        <ResourcePageSchoolDetails
                          errors={props.errors}
                          setSchool={props.setSchool}
                          initialValue={props.schoolId ?? undefined}
                          initialSchoolName={
                            props.school?.length && props.school?.length > 0
                              ? props.school.charAt(0).toUpperCase() +
                                props.school.slice(1)
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
                          {...props.register("email")}
                          error={props.errors?.email?.message}
                        />
                        <P $font="body-3" $mt={-20} $mb={48}>
                          Join over 100k teachers and get free resources and
                          other helpful content by email. Unsubscribe at any
                          time. Read our{" "}
                          <OwaLink
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
                          </OwaLink>
                          .
                        </P>
                        <Controller
                          control={props.control}
                          name="terms"
                          render={({
                            field: { value, onChange, name, onBlur },
                          }) => {
                            const onChangeHandler = (
                              e: ChangeEvent<HTMLInputElement>,
                            ) => {
                              onChange(e.target.checked);
                              props.triggerForm();
                            };
                            return (
                              <ResourcePageTermsAndConditionsCheckbox
                                name={name}
                                checked={value}
                                onChange={onChangeHandler}
                                onBlur={onBlur}
                                id={"terms"}
                                errorMessage={props.errors?.terms?.message}
                                zIndex={"neutral"}
                              />
                            );
                          }}
                        />
                      </Box>
                    )}
                    <CopyrightNotice
                      showPostAlbCopyright={props.showPostAlbCopyright}
                      openLinksExternally={true}
                    />
                  </Flex>
                )}
              </>
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
            {props.cta}

            {props.apiError && !hasFormErrors && (
              <FieldError
                id="download-error"
                data-testid="download-error"
                variant={"large"}
                withoutMarginBottom
              >
                {props.apiError}
              </FieldError>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ResourcePageLayout;
