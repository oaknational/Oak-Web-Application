import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Control, useForm, UseFormTrigger } from "react-hook-form";
import {
  OakBox,
  OakFlex,
  OakMaxWidth,
  OakRadioButton,
  OakRadioGroup,
} from "@oaknational/oak-components";

import FieldError from "@/components/SharedComponents/FieldError";
import {
  OnboardingFormProps,
  WorksInSchoolFormProps,
  worksInSchoolFormSchema,
} from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";
import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";

export const OnboardingView = () => {
  const { formState, setValue, handleSubmit, control, trigger } =
    useForm<WorksInSchoolFormProps>({
      resolver: zodResolver(worksInSchoolFormSchema),
      mode: "onBlur",
    });

  const setWorksInSchool = useCallback(
    (value: boolean) => {
      setValue("worksInSchool", value, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  return (
    <OakFlex $background={"bg-decorative1-main"}>
      <OakMaxWidth $justifyContent={"center"} $height={"100vh"}>
        <OnboardingForm
          control={control as Control<OnboardingFormProps>}
          trigger={trigger as UseFormTrigger<OnboardingFormProps>}
          formState={formState}
          heading="Do you work in a school?"
          handleSubmit={handleSubmit}
          canSubmit={!formState.errors.worksInSchool}
          showNewsletterSignUp={false}
        >
          <OakBox>
            <FieldError id={"onboarding-error"}>
              {formState.errors.worksInSchool?.message}
            </FieldError>

            <OakRadioGroup
              onChange={(value) =>
                setWorksInSchool(value.target.value === "yes")
              }
              $flexDirection={"column"}
              name={"Do you work in a school?"}
              aria-labelledby={"form-legend"}
            >
              <OakRadioButton id="option-1" label="Yes" value="yes" />
              <OakRadioButton id="option-2" label="No" value="no" />
            </OakRadioGroup>
          </OakBox>
        </OnboardingForm>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default OnboardingView;
