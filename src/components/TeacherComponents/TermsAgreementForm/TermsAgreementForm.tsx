import { ChangeEvent, FC, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakBox,
  OakLink,
  OakTextInput,
  OakJauntyAngleLabel,
  OakFieldError,
} from "@oaknational/oak-components";

import FieldError from "@/components/SharedComponents/FieldError";
import ResourcePageDetailsCompleted from "@/components/TeacherComponents/ResourcePageDetailsCompleted";
import ResourcePageSchoolDetails from "@/components/TeacherComponents/ResourcePageSchoolDetails";
import ResourcePageTermsAndConditionsCheckbox from "@/components/TeacherComponents/ResourcePageTermsAndConditionsCheckbox";
import CopyrightNotice from "@/components/TeacherComponents/CopyrightNotice";
import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { resolveOakHref } from "@/common-lib/urls";

export type TermsAgreementFormProps = {
  form: {
    control: Control<ResourceFormProps>;
    register: UseFormRegister<ResourceFormProps>;
    errors: FieldErrors<ResourceFormProps>;
    trigger: UseFormTrigger<ResourceFormProps>;
  };
  isLoading?: boolean;
  email?: string;
  schoolId?: string;
  schoolName?: string;
  setSchool?: (school: string) => void;
  showSavedDetails?: boolean;
  handleEditDetailsCompletedClick?: () => void;
  showPostAlbCopyright?: boolean;
  copyrightYear: string;
  isDownloadPageExperiment?: boolean;
};

const TermsAgreementForm: FC<TermsAgreementFormProps> = ({
  form,
  isLoading = false,
  email = "",
  schoolId = "",
  schoolName = "",
  setSchool = () => {},
  showSavedDetails = false,
  handleEditDetailsCompletedClick = () => {},
  showPostAlbCopyright = true,
  copyrightYear,
  isDownloadPageExperiment = false,
}) => {
  const [emailHasFocus, setEmailHasFocus] = useState(false);
  const { ref, ...emailProps } = form.register("email");

  return (
    <>
      {!isDownloadPageExperiment && (
        <OakHeading
          tag="h2"
          $font={["heading-6", "heading-5"]}
          $mb={["space-between-m", "space-between-m2"]}
        >
          Your details
        </OakHeading>
      )}
      {form?.errors.school && (
        <FieldError ariaLive="polite" id="school-error">
          {form.errors.school?.message}
        </FieldError>
      )}
      {isLoading && (
        <OakP $mb={"space-between-m"} data-testid="loading">
          Loading...
        </OakP>
      )}
      {!isLoading && (
        <OakFlex $flexDirection="column" $gap={"space-between-m"}>
          {showSavedDetails ? (
            <ResourcePageDetailsCompleted
              email={email}
              school={schoolName}
              onEditClick={handleEditDetailsCompletedClick}
            />
          ) : (
            <OakBox
              $maxWidth={
                isDownloadPageExperiment
                  ? null
                  : [null, "all-spacing-21", "all-spacing-21"]
              }
            >
              <ResourcePageSchoolDetails
                errors={form.errors}
                setSchool={setSchool}
                initialValue={schoolId ?? undefined}
                withHomeschool={true}
                initialSchoolName={
                  schoolName?.length && schoolName?.length > 0
                    ? schoolName.charAt(0).toUpperCase() + schoolName.slice(1)
                    : undefined
                }
              />
              <OakFlex
                $position="relative"
                $flexDirection="column"
                ref={ref}
                $mb="space-between-s"
              >
                {form.errors?.email && (
                  <OakBox
                    id={form.errors?.email.message}
                    role="alert"
                    $mv="space-between-s"
                  >
                    <OakFieldError>{form.errors?.email.message}</OakFieldError>
                  </OakBox>
                )}
                <OakJauntyAngleLabel
                  label={"Email (optional)"}
                  as="label"
                  $color={
                    form.errors?.email || emailHasFocus ? "white" : "black"
                  }
                  htmlFor={"email"}
                  id={"email-label"}
                  $font={"heading-7"}
                  $background={
                    form.errors?.email
                      ? "red"
                      : emailHasFocus
                        ? "blue"
                        : "lemon"
                  }
                  $zIndex="in-front"
                  $position="absolute"
                  $top={"-20px"}
                  $left={"5px"}
                  $borderRadius="border-radius-square"
                  data-testid="jaunty-label"
                />
                <OakTextInput
                  id={"email"}
                  {...emailProps}
                  data-testid="inputEmail"
                  autoComplete="email"
                  placeholder="Enter email address here"
                  onFocus={() => setEmailHasFocus(true)}
                  onBlur={(e) => {
                    emailProps.onBlur(e);
                    setEmailHasFocus(false);
                  }}
                  $pv="inner-padding-none"
                  wrapperWidth="100%"
                  $height="all-spacing-10"
                />
              </OakFlex>
              <OakBox
                $font="body-3"
                $mb={"space-between-l"}
                data-testid="newsletter-policy"
              >
                Join over 100k teachers and get free resources and other helpful
                content by email. Unsubscribe at any time. Read our{" "}
                <OakLink
                  href={resolveOakHref({
                    page: "legal",
                    legalSlug: "privacy-policy",
                  })}
                  aria-label="Privacy policy (opens in a new tab)"
                  target="_blank"
                  iconName="external"
                  isTrailingIcon
                  iconHeight="all-spacing-5"
                  iconWidth="all-spacing-5"
                >
                  privacy policy
                </OakLink>
                .
              </OakBox>
              <Controller
                control={form.control}
                name="terms"
                render={({ field: { value, onChange, name, onBlur } }) => {
                  const onChangeHandler = (
                    e: ChangeEvent<HTMLInputElement>,
                  ) => {
                    onChange(e.target.checked);
                    form.trigger();
                  };
                  return (
                    <ResourcePageTermsAndConditionsCheckbox
                      name={name}
                      checked={value}
                      onChange={onChangeHandler}
                      onBlur={onBlur}
                      id={"terms"}
                      errorMessage={form.errors?.terms?.message}
                    />
                  );
                }}
              />
            </OakBox>
          )}
          {!isDownloadPageExperiment && (
            <OakBox $maxWidth="all-spacing-21">
              <CopyrightNotice
                showPostAlbCopyright={showPostAlbCopyright}
                openLinksExternally={true}
                copyrightYear={copyrightYear}
              />
            </OakBox>
          )}
        </OakFlex>
      )}
    </>
  );
};

export default TermsAgreementForm;
