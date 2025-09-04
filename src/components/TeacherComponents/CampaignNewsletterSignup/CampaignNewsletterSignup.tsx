import { FC, FormEvent, useState } from "react";
import {
  OakFlex,
  OakPrimaryButton,
  OakHeading,
} from "@oaknational/oak-components";
import { PortableTextReactComponents } from "@portabletext/react";

import { newsletterSignupFormSubmitSchema } from "./CampaignNewsletterSignup.schema";

import { OakInputWithLabel } from "@/components/SharedComponents/OakInputWithLabel/OakInputWithLabel";
import YourDetails, {
  School,
} from "@/components/CurriculumComponents/OakComponentsKitchen/YourDetails"; // School,
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { NewsletterSignUp } from "@/common-lib/cms-types/campaignPage";
import { useFetch } from "@/hooks/useFetch";
import { runSchema } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const [errors, setErrors] = useState<NewsletterSignUpFormErrors>({});

  const [data, setData] = useState<NewsletterSignUpData>(() => ({
    schoolId: undefined,
    schoolName: undefined,
    email: undefined,
    schoolNotListed: false,
    schools: [],
    name: "",
  }));

  const onChange = (partial: Partial<NewsletterSignUpData>) => {
    const newData = {
      ...data,
      ...partial,
    };
    setData?.(newData);
  };

  const schoolPickerInputValue = data.schoolName;
  const { data: schools } = useFetch<School[]>(
    `https://school-picker.thenational.academy/${schoolPickerInputValue}`,
    "school-picker/fetch-suggestions",
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formValidation = runSchema(newsletterSignupFormSubmitSchema, data);

    setErrors(formValidation.errors);
    console.log(data, formValidation);

    if (formValidation.success) {
      setErrors({});
      console.log(data);
      try {
        // call hubspot
        console.log(formId);
      } catch (e) {
        // report error
      } finally {
        setIsSubmitting(false);
        setData({});
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
          </OakFlex>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
};

export default CampaignNewsletterSignup;
