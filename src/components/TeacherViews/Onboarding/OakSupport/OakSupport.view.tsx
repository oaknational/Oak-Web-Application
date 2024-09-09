import { zodResolver } from "@hookform/resolvers/zod";
import { OakCheckBox, OakFlex } from "@oaknational/oak-components";
import { Control, UseFormTrigger, useForm } from "react-hook-form";

import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";
import {
  OakSupportFormProps,
  OnboardingFormProps,
  extendedOakSupportSchema,
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

type OakSupportKey = keyof typeof oakSupportMap;

const OakSupport = () => {
  const {
    formState,
    setValue,
    handleSubmit,
    clearErrors,
    getValues,
    control,
    trigger,
  } = useForm<OakSupportFormProps>({
    resolver: zodResolver(extendedOakSupportSchema),
    mode: "onBlur",
  });

  const handleToggleCheckbox = (key: OakSupportKey) => {
    const currentValue = getValues(key);
    setValue(key, !currentValue);
    clearErrors(key);
  };

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
