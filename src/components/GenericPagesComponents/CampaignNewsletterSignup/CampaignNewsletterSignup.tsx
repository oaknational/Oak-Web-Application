import { FC, FormEvent, useState } from "react";
import {
  OakFlex,
  OakPrimaryButton,
  OakHeading,
  OakP,
  OakBox,
} from "@oaknational/oak-components";
import { PortableTextReactComponents } from "@portabletext/react";

import { useNewsletterForm } from "../NewsletterForm";

import { newsletterSignupFormSubmitSchema } from "./CampaignNewsletterSignup.schema";

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
  textStyles: Partial<PortableTextReactComponents>;
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
    schoolId: "",
    schoolName: "",
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
    const formValidation = runSchema(newsletterSignupFormSubmitSchema, data);

    setErrors(formValidation.errors);

    if (formValidation.success) {
      setErrors({});
      console.log(data);
      try {
        await onHubspotSubmit({
          school: data.schoolId ?? "notListed",
          schoolName: data.schoolName,
          email: data.email,
          userRole: "",
        });
        setSuccessMessage("Thanks, that's been received");
        console.log(formId);
      } catch (error) {
        if (error instanceof OakError) {
          setSubmitError(error.message);
        } else {
          reportError(error);
          setSubmitError("An unknown error occurred");
        }
      } finally {
        setIsSubmitting(false);
        setData({
          schoolId: "",
          schoolName: "",
          email: "",
          schoolNotListed: false,
          schools: [],
          name: "",
        });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <OakFlex
      $maxWidth={"all-spacing-24"}
      $flexDirection={["column", "row"]}
      $gap={"space-between-xxl"}
      $borderRadius={"border-radius-xl"}
      $pv={["inner-padding-xl8"]}
      $ph={["inner-padding-xl8"]}
    >
      <OakFlex
        $flexDirection={"column"}
        $alignItems={"flex-end"}
        $gap={"space-between-m"}
        $alignSelf={"stretch"}
      >
        <OakFlex
          $flexDirection={"row"}
          $alignItems={"center"}
          $alignSelf={"stretch"}
          $gap={"space-between-xxxl"}
        >
          <OakFlex
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
            // onSubmit={this.handleSubmit}
            $flexDirection={"column"}
            $background={"white"}
            $pa={"inner-padding-xl"}
            $gap={"space-between-m"}
            $borderRadius={"border-radius-s"}
          >
            <OakInputWithLabel
              label="Name"
              id="nameInput"
              name="Name"
              error={errors.name}
              onChange={(e) => onChange({ name: e.target.value })}
              required={true}
              labelBackground="mint"
              placeholder="Type your name"
              value={data.name}
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
            <OakPrimaryButton
              type="submit"
              iconName="arrow-right"
              isTrailingIcon
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              {buttonCta}
            </OakPrimaryButton>
            {(submitError.length > 0 || successMessage.length > 0) && (
              <OakBox>
                <OakP
                  $mt={submitError ? "space-between-s" : "space-between-none"}
                  $font={"body-3"}
                  aria-live="assertive"
                  role="alert"
                  $color="red"
                >
                  {submitError}
                </OakP>
                <OakP
                  $mt={
                    !submitError && successMessage
                      ? "space-between-s"
                      : "space-between-none"
                  }
                  $font={"body-3"}
                  aria-live="polite"
                >
                  {!submitError && successMessage}
                </OakP>
              </OakBox>
            )}
          </OakFlex>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
};

export default CampaignNewsletterSignup;
