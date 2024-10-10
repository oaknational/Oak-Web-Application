import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakCheckBox,
  OakFlex,
  OakLink,
  OakSecondaryButton,
  OakSpan,
} from "@oaknational/oak-components";
import { Control, UseFormTrigger, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useEffect } from "react";

import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";
import {
  UseOfOakFormProps,
  OnboardingFormProps,
  extendedUseOfOakSchema,
} from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";
import { OnboardingLayout } from "@/components/TeacherComponents/OnboardingLayout/OnboardingLayout";
import FieldError from "@/components/SharedComponents/FieldError";
import { resolveOakHref } from "@/common-lib/urls";
import { decodeOnboardingDataQueryParam } from "@/components/TeacherComponents/OnboardingForm/onboardingDataQueryParam";

export const oakSupportMap = {
  curriculumDesign: "To help with our curriculum design",
  departmentResources: "To support my department with specialist resources",
  enhanceSkills:
    "To enhance my skills in subjects or topics outside my expertise",
  resourcesInspiration:
    "To get resources or inspiration for a topic that I plan to teach",
  disruptionLearning:
    "To manage a disruption to learning, eg. absences, cover lesson, remote learning",
};

export type OakSupportKey = keyof typeof oakSupportMap;

const HowCanOakSupport = () => {
  const router = useRouter();
  const onboardingState = decodeOnboardingDataQueryParam(router.query);
  const {
    formState,
    setValue,
    handleSubmit,
    clearErrors,
    getValues,
    control,
    trigger,
  } = useForm<UseOfOakFormProps>({
    resolver: zodResolver(extendedUseOfOakSchema),
    mode: "onBlur",
    defaultValues: {
      ...onboardingState,
      curriculumDesign: false,
      departmentResources: false,
      enhanceSkills: false,
      resourcesInspiration: false,
      disruptionLearning: false,
    },
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  const handleToggleCheckbox = (key: OakSupportKey) => {
    const currentValue = getValues(key);
    setValue(key, !currentValue);
    clearErrors(key);
  };

  const hasMissingFormData = Object.values(formState.errors).some(
    (error) => error.message !== undefined,
  );

  return (
    <OnboardingLayout
      promptBody="Tell us a little bit about you so we can tailor Oak to suit your needs."
      promptHeading="Last step..."
    >
      <OnboardingForm
        heading="How can Oak support you?"
        formState={formState}
        canSubmit={formState.isValid}
        handleSubmit={handleSubmit}
        control={control as Control<OnboardingFormProps>}
        trigger={trigger as UseFormTrigger<OnboardingFormProps>}
        forceHideNewsletterSignUp={true}
        subheading="Select all that apply"
        secondaryButton={(isSubmitting) => (
          <OakSecondaryButton
            width="100%"
            disabled={hasMissingFormData || isSubmitting}
          >
            Skip
          </OakSecondaryButton>
        )}
      >
        <OakFlex $flexDirection="column" $gap="space-between-s">
          {Object.entries(oakSupportMap).map(([key, value]) => (
            <OakCheckBox
              id={key}
              key={key}
              value={value}
              onChange={() => handleToggleCheckbox(key as OakSupportKey)}
            />
          ))}
          {hasMissingFormData && (
            <FieldError id="missing-values" withoutMarginBottom>
              An error occurred. Please{" "}
              <OakLink
                href={resolveOakHref({ page: "onboarding-school-selection" })}
              >
                <OakSpan $color="text-error" $textDecoration="underline">
                  go back
                </OakSpan>
              </OakLink>{" "}
              to the previous step and try again.
            </FieldError>
          )}
        </OakFlex>
      </OnboardingForm>
    </OnboardingLayout>
  );
};

export default HowCanOakSupport;
