import { ChangeEvent, FC } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";
import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

import FieldError from "@/components/SharedComponents/FieldError";
import Box from "@/components/SharedComponents/Box";
import OakLink from "@/components/SharedComponents/OwaLink";
import Input from "@/components/SharedComponents/Input";
import Icon from "@/components/SharedComponents/Icon";
import ResourcePageDetailsCompleted from "@/components/TeacherComponents/ResourcePageDetailsCompleted";
import ResourcePageSchoolDetails from "@/components/TeacherComponents/ResourcePageSchoolDetails";
import ResourcePageTermsAndConditionsCheckbox from "@/components/TeacherComponents/ResourcePageTermsAndConditionsCheckbox";
import CopyrightNotice from "@/components/TeacherComponents/CopyrightNotice";
import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { P } from "@/components/SharedComponents/Typography";

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
  updatedAt?: string;
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
  updatedAt,
}) => {
  return (
    <>
      <OakHeading
        tag="h2"
        $font={["heading-6", "heading-5"]}
        $mb={["space-between-m", "space-between-m2"]}
      >
        Your details
      </OakHeading>
      {form?.errors.school && (
        <FieldError id="school-error">{form.errors.school?.message}</FieldError>
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
            <Box $maxWidth={[null, 420, 420]}>
              <ResourcePageSchoolDetails
                errors={form.errors}
                setSchool={setSchool}
                initialValue={schoolId ?? undefined}
                initialSchoolName={
                  schoolName?.length && schoolName?.length > 0
                    ? schoolName.charAt(0).toUpperCase() + schoolName.slice(1)
                    : undefined
                }
              />

              <Input
                id={"email"}
                data-testid="inputEmail"
                label="Email"
                autoComplete="email"
                placeholder="Enter email address here"
                isOptional={true}
                {...form.register("email")}
                error={form.errors?.email?.message}
              />
              <P
                $font="body-3"
                $mt={-20}
                $mb={48}
                data-testid="newsletter-policy"
              >
                Join over 100k teachers and get free resources and other helpful
                content by email. Unsubscribe at any time. Read our{" "}
                <OakLink
                  page="legal"
                  legalSlug="privacy-policy"
                  $isInline
                  htmlAnchorProps={{
                    target: "_blank",
                    "aria-label": "Privacy policy (opens in a new tab)",
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
            </Box>
          )}
          <CopyrightNotice
            showPostAlbCopyright={showPostAlbCopyright}
            openLinksExternally={true}
            copyrightYear={updatedAt}
          />
        </OakFlex>
      )}
    </>
  );
};

export default TermsAgreementForm;
