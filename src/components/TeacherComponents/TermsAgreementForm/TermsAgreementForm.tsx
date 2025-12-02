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
import CopyrightNotice from "@/components/TeacherComponents/OglCopyrightNotice";
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
  oglCopyrightYear: string;
  useDownloadPageLayout?: boolean;
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
  oglCopyrightYear,
  useDownloadPageLayout = false,
}) => {
  const [emailHasFocus, setEmailHasFocus] = useState(false);
  const { ref, ...emailProps } = form.register("email");

  return (
    <>
      {!useDownloadPageLayout && (
        <OakHeading
          tag="h2"
          $font={["heading-6", "heading-5"]}
          $mb={["spacing-24", "spacing-32"]}
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
        <OakP $mb={"spacing-24"} data-testid="loading">
          Loading...
        </OakP>
      )}
      {!isLoading && (
        <OakFlex $flexDirection="column" $gap={"spacing-24"}>
          {showSavedDetails ? (
            <ResourcePageDetailsCompleted
              email={email}
              school={schoolName}
              onEditClick={handleEditDetailsCompletedClick}
            />
          ) : (
            <OakBox
              $maxWidth={
                useDownloadPageLayout
                  ? null
                  : [null, "spacing-480", "spacing-480"]
              }
            >
              <ResourcePageSchoolDetails
                errors={form.errors}
                setSchool={setSchool}
                initialValue={schoolId ?? undefined}
                withHomeschool={true}
                initialSchoolName={
                  schoolName?.length &&
                  schoolName?.length > 0 &&
                  schoolName !== "notListed"
                    ? schoolName.charAt(0).toUpperCase() + schoolName.slice(1)
                    : undefined
                }
              />
              <OakFlex
                $position="relative"
                $flexDirection="column"
                ref={ref}
                $mb="spacing-16"
              >
                {form.errors?.email && (
                  <OakBox
                    id={form.errors?.email.message}
                    role="alert"
                    $mv="spacing-16"
                  >
                    <OakFieldError>{form.errors?.email.message}</OakFieldError>
                  </OakBox>
                )}
                <OakJauntyAngleLabel
                  label={"Email (optional)"}
                  as="label"
                  $color={
                    form.errors?.email || emailHasFocus
                      ? "text-inverted"
                      : "text-primary"
                  }
                  htmlFor={"email"}
                  id={"email-label"}
                  $font={"heading-7"}
                  $background={
                    form.errors?.email
                      ? "bg-error"
                      : emailHasFocus
                        ? "blue"
                        : "bg-decorative5-main"
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
                  $pv="spacing-0"
                  wrapperWidth="100%"
                  $height="spacing-56"
                />
              </OakFlex>
              <OakBox
                $font="body-3"
                $mb={"spacing-48"}
                data-testid="newsletter-policy"
              >
                Join over 200k teachers and get free resources and other helpful
                content by email. Oak is free, and always will be. Unsubscribe
                at any time. Read our{" "}
                <OakLink
                  href={resolveOakHref({
                    page: "legal",
                    legalSlug: "privacy-policy",
                  })}
                  aria-label="Privacy policy (opens in a new tab)"
                  target="_blank"
                  iconName="external"
                  isTrailingIcon
                  iconHeight="spacing-20"
                  iconWidth="spacing-20"
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
          {!useDownloadPageLayout && (
            <OakBox $maxWidth="spacing-480">
              <CopyrightNotice
                showPostAlbCopyright={showPostAlbCopyright}
                openLinksExternally={true}
                copyrightYear={oglCopyrightYear}
              />
            </OakBox>
          )}
        </OakFlex>
      )}
    </>
  );
};

export default TermsAgreementForm;
