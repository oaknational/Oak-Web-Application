import { FC, FormEvent, useState } from "react";
import {
  OakFlex,
  OakPrimaryButton,
  OakHeading,
  OakP,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";
import { PortableTextReactComponents } from "@portabletext/react";

import { newsletterSignupFormSubmitSchema } from "./CampaignNewsletterSignup.schema";

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

type NewsletterSignUpData = Partial<{
  schools: School[];
  schoolId?: string;
  schoolName?: string;
  email?: string;
  schoolNotListed?: boolean;
  name: string;
}>;

type NewsletterSignUpFormErrors = Partial<{
  schoolId: string;
  schoolNotListed: string;
  email: string;
  name: string;
}>;

export type CampaignNewsletterSignupProps = NewsletterSignUp & {
  textStyles?: Partial<PortableTextReactComponents>;
};

const CampaignNewsletterSignup: FC<CampaignNewsletterSignupProps> = ({
  heading,
  bodyPortableText,
  buttonCta,
  formId,
  textStyles,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errors, setErrors] = useState<NewsletterSignUpFormErrors>({});

  const [data, setData] = useState<NewsletterSignUpData>(() => ({
    schoolId: undefined,
    schoolName: undefined,
    email: "",
    schoolNotListed: false,
    schools: [],
    name: "",
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

  const schoolPickerInputValue = data.schoolName;
  const { data: schools } = useFetch<School[]>(
    `https://school-picker.thenational.academy/${schoolPickerInputValue}`,
    "school-picker/fetch-suggestions",
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");
    const formValidation = runSchema(newsletterSignupFormSubmitSchema, data);

    setErrors(formValidation.errors);
    if (formValidation.success) {
      setErrors({});
      try {
        await onHubspotSubmit({
          school: data.schoolId ?? "notListed",
          schoolName: data.schoolName,
          email: data.email,
          userRole: "",
        });
        setSuccessMessage("Thanks, that's been received");
        setData({
          schoolId: undefined,
          schoolName: undefined,
          email: "",
          schoolNotListed: false,
          schools: [],
          name: "",
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
      $mt={["space-between-xxl", "space-between-xxl", "space-between-xxxl"]}
      $maxWidth={["unset", "all-spacing-24"]}
    >
      <OakGridArea
        $colSpan={[12, 10, 10]}
        $colStart={[1, 2, 2]}
        $mb={["space-between-m", "space-between-l"]}
      >
        <OakFlex
          $flexDirection={["column", "row"]}
          $alignItems={"center"}
          $alignSelf={"stretch"}
          $gap={"space-between-xxl"}
        >
          <OakFlex
            $maxWidth={["100%", "all-spacing-22"]}
            $alignSelf={"stretch"}
            $flexDirection={"column"}
            $gap={"space-between-s"}
          >
            <OakHeading tag="h4" $font={"heading-light-4"}>
              {heading}
            </OakHeading>
            <PortableTextWithDefaults
              value={bodyPortableText}
              components={textStyles}
            />
          </OakFlex>
          <OakFlex
            as="form"
            // onSubmit={handleSubmit}
            $minWidth={["min-content", "all-spacing-21"]}
            $flexDirection={"column"}
            $background={"white"}
            $pa={"inner-padding-xl"}
            $gap={"space-between-m"}
            $borderRadius={"border-radius-s"}
          >
            <OakFlex $flexDirection={"column"} $gap={"space-between-m2"}>
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
              <YourDetails
                data={data}
                schools={schools ?? []}
                errors={errors}
                onChange={onChange}
                labelBackground="mint"
                hidePrivacyPolicy={true}
                emailRequired={true}
              />
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
                $mt={"space-between-none"}
                $font={"body-3"}
                aria-live="assertive"
                role="alert"
                $color="red"
              >
                {submitError}
              </OakP>
            )}
            {successMessage.length > 0 && submitError === "" && (
              <OakP
                $mt={"space-between-none"}
                $font={"body-3"}
                aria-live="polite"
              >
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
