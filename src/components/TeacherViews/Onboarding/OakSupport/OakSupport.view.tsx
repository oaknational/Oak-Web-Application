import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakCheckBox,
  OakFlex,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import { Control, UseFormTrigger, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";

import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";
import {
  UseOfOakFormProps,
  OnboardingFormProps,
  extendedUseOfOakSchema,
} from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";
import { OnboardingLayout } from "@/components/TeacherComponents/OnboardingLayout/OnboardingLayout";

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

const OakSupport = () => {
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
      curriculumDesign: false,
      departmentResources: false,
      enhanceSkills: false,
      resourcesInspiration: false,
      disruptionLearning: false,
    },
  });
  const router = useRouter();

  const handleToggleCheckbox = (key: OakSupportKey) => {
    const currentValue = getValues(key);
    setValue(key, !currentValue);
    clearErrors(key);
  };

  useEffect(() => {
    const queryData = router.query;
    const schoolName = queryData.schoolName;
    if (schoolName && typeof schoolName === "string") {
      setValue("schoolName", decodeURI(schoolName));
    }
    const school = queryData.school;
    if (school && typeof school === "string") {
      setValue("school", decodeURI(school));
    }
    const manualSchoolName = queryData.manualSchoolName;
    if (manualSchoolName && typeof manualSchoolName === "string") {
      setValue("manualSchoolName", decodeURI(manualSchoolName));
    }
    const schoolAddress = queryData.schoolAddress;
    if (schoolAddress && typeof schoolAddress === "string") {
      setValue("schoolAddress", decodeURI(schoolAddress));
    }
    const newsletterSignUp = queryData.newsletterSignUp;
    if (newsletterSignUp) {
      setValue("newsletterSignUp", newsletterSignUp === "true");
    }
    trigger();
  }, [router.query, setValue, trigger]);

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
        showNewsletterSignUp={false}
        subheading="Select all that apply"
        secondaryButton={
          <OakSecondaryButton width="100%" $mt="space-between-xs">
            Skip
          </OakSecondaryButton>
        }
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
        </OakFlex>
      </OnboardingForm>
    </OnboardingLayout>
  );
};

export default OakSupport;
