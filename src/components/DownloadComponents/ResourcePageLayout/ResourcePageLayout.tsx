import { ChangeEvent, FC } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import { DownloadFormProps, ErrorKeysType } from "../downloads.types";
import NoResourcesToDownload from "../NoResourcesToDownload";
import DetailsCompleted from "../DetailsCompleted";
import { DetailsCompletedProps } from "../DetailsCompleted/DetailsCompleted";
import SchoolDetails from "../SchoolDetails";
import { SchoolDetailsProps } from "../SchoolDetails/SchoolDetails";
import TermsAndConditionsCheckbox from "../TermsAndConditionsCheckbox";
import CopyrightNotice from "../CopyrightNotice";

import getDownloadFormErrorMessage from "@/components/DownloadComponents/helpers/getDownloadFormErrorMessage";
import { Heading, LI, P, UL } from "@/components/Typography";
import FieldError from "@/components/FormFields/FieldError";
import Box from "@/components/Box";
import Checkbox from "@/components/Checkbox";
import Flex from "@/components/Flex";
import Input from "@/components/Input";
import OakLink from "@/components/OakLink";
import Icon from "@/components/Icon";

/** Generic layout component for Downloads and Share page */

export type ResourcePageLayoutProps = DetailsCompletedProps &
  SchoolDetailsProps & {
    header: string;
    handleToggleSelectAll: () => void;
    selectAllChecked: boolean;
    errors: FieldErrors<DownloadFormProps>;
    cardGroup: React.ReactNode;
    showLoading: boolean;
    showNoResources: boolean;
    schoolId?: string;
    register: UseFormRegister<DownloadFormProps>;
    control: Control<DownloadFormProps>;
    showPostAlbCopyright: boolean;
    showSavedDetails: boolean;
    cta: React.ReactNode;
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
          <Flex $flexDirection="column" $gap={24}>
            <Heading tag="h2" $font={["heading-6", "heading-5"]}>
              Lesson resources
            </Heading>
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
            <FieldError id={"downloads-error"}>
              {props.errors?.downloads?.message}
            </FieldError>
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
              <NoResourcesToDownload />
            ) : (
              <>
                {props.showLoading ? (
                  <P $mt={24}>Loading...</P>
                ) : (
                  <Flex $flexDirection="column" $gap={24}>
                    {props.showSavedDetails ? (
                      <DetailsCompleted
                        email={props.email}
                        school={props.school}
                        onEditClick={props.onEditClick}
                      />
                    ) : (
                      <Box $maxWidth={[null, 420, 420]}>
                        <SchoolDetails
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
                          <OakLink
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
                          </OakLink>
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
                              return onChange(e.target.checked);
                            };
                            return (
                              <TermsAndConditionsCheckbox
                                name={name}
                                checked={value}
                                onChange={onChangeHandler}
                                onBlur={onBlur}
                                id={"terms"}
                                errorMessage={props.errors?.terms?.message}
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
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ResourcePageLayout;
