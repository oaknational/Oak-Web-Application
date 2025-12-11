import { FC, FormEvent, useState } from "react";
import {
  OakFlex,
  OakPrimaryButton,
  OakHeading,
  OakP,
  OakGrid,
  OakGridArea,
  OakFieldError,
  OakBox,
  OakJauntyAngleLabel,
  OakSelect,
  OakOption,
} from "@oaknational/oak-components";
import { PortableTextReactComponents } from "@portabletext/react";
import z, { ZodSchema } from "zod";

import {
  newsletterSignupFormSubmitSchema,
  newsletterSignupRoleSchema,
  partialNewsletterSchema,
} from "./CampaignNewsletterSignup.schema";

import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { OakInputWithLabel } from "@/components/SharedComponents/OakInputWithLabel/OakInputWithLabel";
import YourDetails, {
  School,
} from "@/components/CurriculumComponents/OakComponentsKitchen/YourDetails"; // School,
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { NewsletterSignUp } from "@/common-lib/cms-types/campaignPage";
import { useFetch } from "@/hooks/useFetch";
import { runSchema } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";
import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";
import { EDU_ROLES } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";

const reportError = errorReporter("CampaignNewsletterSignup");

type NewsletterSignUpData = Partial<{
  schools: School[];
  schoolId?: string;
  schoolName?: string;
  email?: string;
  schoolNotListed?: boolean;
  name: string;
  schoolOrg?: string;
  role: string;
  eduRole: string;
}>;

type NewsletterSignUpFormErrors = Partial<{
  schoolId: string;
  schoolNotListed: string;
  schoolOrg: string;
  email: string;
  name: string;
  role: string;
  eduRole: string;
}>;

export type CampaignNewsletterSignupProps = NewsletterSignUp & {
  textStyles?: Partial<PortableTextReactComponents>;
};

const SchoolPickerInput = ({
  errors,
  data,
  onChange,
}: {
  errors: NewsletterSignUpFormErrors;
  data: NewsletterSignUpData;
  onChange: (data: Partial<NewsletterSignUpData>) => void;
}) => {
  const schoolPickerInputValue = data.schoolName;
  const { data: schools } = useFetch<School[]>(
    `https://school-picker.thenational.academy/${schoolPickerInputValue}`,
    "school-picker/fetch-suggestions",
  );

  return (
    <>
      {errors.schoolId && (
        <OakBox id={errors.schoolId} role="alert">
          <OakFieldError>{errors.schoolId}</OakFieldError>
        </OakBox>
      )}
      <YourDetails
        data={data}
        schools={schools ?? []}
        errors={errors}
        onChange={onChange}
        labelBackground="mint"
        hidePrivacyPolicy={true}
        emailRequired={true}
      />
    </>
  );
};

function getSchema({
  freeSchoolInput,
  enableRole,
}: {
  freeSchoolInput?: boolean | null;
  enableRole?: boolean | null;
}) {
  let schema: ZodSchema = newsletterSignupFormSubmitSchema;
  if (freeSchoolInput) {
    schema = partialNewsletterSchema;
  }
  if (enableRole) {
    schema = z.intersection(schema, newsletterSignupRoleSchema);
  }
  return schema;
}

const CampaignNewsletterSignup: FC<CampaignNewsletterSignupProps> = ({
  heading,
  bodyPortableText,
  buttonCta,
  formId,
  textStyles,
  freeSchoolInput,
  enableRole,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errors, setErrors] = useState<NewsletterSignUpFormErrors>({});

  const [data, setData] = useState<NewsletterSignUpData>(() => ({
    schoolId: undefined,
    schoolName: undefined,
    email: undefined,
    schoolNotListed: false,
    schools: [],
    name: undefined,
    schoolOrg: undefined,
    eduRole: undefined,
  }));

  const onChange = (partial: Partial<NewsletterSignUpData>) => {
    const newData = {
      ...data,
      ...partial,
    };
    setData(newData);
  };

  const { onSubmit: onHubspotSubmit } = useNewsletterForm({
    hubspotNewsletterFormId: formId,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");
    const schema = getSchema({
      freeSchoolInput,
      enableRole,
    });
    const formValidation = runSchema(schema, data);

    setErrors(formValidation.errors);
    if (formValidation.success) {
      setErrors({});
      try {
        const schoolData = freeSchoolInput
          ? { schoolName: data.schoolOrg }
          : {
              school: data.schoolId ?? "notListed",
              schoolName: data.schoolName,
            };
        await onHubspotSubmit({
          ...schoolData,
          email: data.email,
          userRole: "",
          eduRole: data.eduRole ?? "",
          name: data.name,
        });
        setSuccessMessage("Thanks, that's been received");
        setData({
          schoolId: undefined,
          schoolName: undefined,
          email: undefined,
          schoolNotListed: false,
          schools: [],
          name: undefined,
          schoolOrg: undefined,
        });
      } catch (error) {
        if (error instanceof OakError) {
          setSubmitError(error.message);
        } else {
          reportError(error);
          setSubmitError("An unknown error occurred");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <OakGrid
      $mt={["spacing-72", "spacing-72", "spacing-80"]}
      $maxWidth={["unset", "spacing-1280"]}
    >
      <OakGridArea
        $colSpan={[12, 10, 10]}
        $colStart={[1, 2, 2]}
        $mb={["spacing-24", "spacing-48"]}
      >
        <OakFlex
          $flexDirection={["column", "column", "row"]}
          $alignItems={"center"}
          $alignSelf={"stretch"}
          $gap={"spacing-72"}
          $justifyContent={"space-between"}
        >
          <OakFlex
            $maxWidth={["100%", "spacing-640"]}
            $alignSelf={"stretch"}
            $flexDirection={"column"}
            $gap={"spacing-16"}
          >
            <OakHeading tag="h4" $font={"heading-4"}>
              {heading}
            </OakHeading>
            <PortableTextWithDefaults
              value={bodyPortableText}
              components={textStyles}
            />
          </OakFlex>
          <OakFlex
            as="form"
            $minWidth={["100%", "100%", "spacing-480"]}
            $flexDirection={"column"}
            $background={"white"}
            $pa={"spacing-24"}
            $gap={"spacing-24"}
            $borderRadius={"border-radius-s"}
          >
            <OakFlex $flexDirection={"column"} $gap={"spacing-32"}>
              <OakInputWithLabel
                label="Name"
                id="nameInput"
                name="Name"
                error={errors.name}
                onChange={(e) => onChange({ name: e.target.value })}
                required={true}
                labelBackground="mint"
                placeholder="Type your name"
                defaultValue={data.name}
              />

              {enableRole && (
                <>
                  {errors.eduRole && (
                    <OakBox
                      id={errors.eduRole}
                      role="alert"
                      $pb={["spacing-24"]}
                    >
                      <OakFieldError>{errors.eduRole}</OakFieldError>
                    </OakBox>
                  )}
                  <OakBox
                    $position={"relative"}
                    data-testid="newsletter-eduRole"
                  >
                    <OakJauntyAngleLabel
                      label={`Role`}
                      $color={"text-primary"}
                      htmlFor={"newsletter-eduRole"}
                      as="label"
                      $font={"heading-7"}
                      $background={"mint"}
                      $zIndex="in-front"
                      $position="absolute"
                      $top={"-20px"}
                      $left={"5px"}
                      $borderRadius="border-radius-square"
                      required={true}
                      error={errors.eduRole}
                    />
                    <OakSelect
                      name="newsletter-eduRole"
                      id="newsletter-eduRole"
                      $display={"block"}
                      value={data.eduRole}
                      onChange={(e) => {
                        onChange({ eduRole: e.target.value });
                      }}
                    >
                      <OakOption asDefault={true}>Select your role</OakOption>
                      {EDU_ROLES.map((item) => {
                        return (
                          <OakOption key={item} value={item}>
                            {item}
                          </OakOption>
                        );
                      })}
                    </OakSelect>
                  </OakBox>
                </>
              )}

              {freeSchoolInput ? (
                <>
                  <OakInputWithLabel
                    label={`School or organisation (optional)`}
                    id="newsletter-school"
                    data-testid="newsletter-school"
                    error={errors.schoolOrg}
                    onChange={(e) => onChange({ schoolOrg: e.target.value })}
                    required={false}
                    placeholder="Type your school or organisation"
                    name="newsletter-school"
                    labelBackground={"mint"}
                    defaultValue={data.schoolOrg}
                  />
                  <OakInputWithLabel
                    label={`Email`}
                    id="newsletter-email"
                    data-testid="newsletter-email"
                    error={errors.email}
                    onChange={(e) => onChange({ email: e.target.value })}
                    required={true}
                    placeholder="Type your email address"
                    name="newsletter-email"
                    labelBackground={"mint"}
                    defaultValue={data.email}
                  />
                </>
              ) : (
                <SchoolPickerInput
                  errors={errors}
                  onChange={onChange}
                  data={data}
                />
              )}
            </OakFlex>
            <OakPrimaryButton
              type="submit"
              iconName="arrow-right"
              isTrailingIcon
              isLoading={isSubmitting}
              onClick={handleSubmit}
              width={"100%"}
            >
              {buttonCta}
            </OakPrimaryButton>
            {submitError.length > 0 && (
              <OakP
                $mt={"spacing-0"}
                $font={"body-3"}
                aria-live="assertive"
                role="alert"
                $color="red"
              >
                {submitError}
              </OakP>
            )}
            {successMessage.length > 0 && submitError === "" && (
              <OakP $mt={"spacing-0"} $font={"body-3"} aria-live="polite">
                {!submitError && successMessage}
              </OakP>
            )}
          </OakFlex>
        </OakFlex>
      </OakGridArea>
    </OakGrid>
  );
};

export default CampaignNewsletterSignup;
