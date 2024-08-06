import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";
import ResourcePageSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import Logo from "@/components/AppComponents/Logo";
import OwaLink from "@/components/SharedComponents/OwaLink";

const onboardingFormSchema = z.object({
  school: z
    .string({
      errorMap: () => ({
        message: "Select school",
      }),
    })
    .min(1, "Select school"),
  schoolName: z.string().optional(),
});
type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
type OnboardingFormProps = OnboardingFormValues & {
  onSubmit: (values: OnboardingFormValues) => Promise<void>;
};

export const OnboardingView = () => {
  const { formState, setValue, handleSubmit } = useForm<OnboardingFormProps>({
    resolver: zodResolver(onboardingFormSchema),
    mode: "onBlur",
  });

  const setSchoolDetailsInForm = useCallback(
    (value: string, name: string) => {
      setValue("school", value, {
        shouldValidate: true,
      });
      setValue("schoolName", name, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const {
    selectedSchool,
    setSelectedSchool,
    schoolPickerInputValue,
    setSchoolPickerInputValue,
    schools,
  } = useSchoolPicker({ withHomeschool: false });

  useEffect(() => {
    if (selectedSchool && schoolPickerInputValue !== "") {
      setSchoolDetailsInForm(selectedSchool.toString(), schoolPickerInputValue);
    }
  }, [selectedSchool, schoolPickerInputValue, setSchoolDetailsInForm]);

  const onSchoolPickerInputChange = (value: React.SetStateAction<string>) => {
    if (value === "") {
      setSchoolDetailsInForm("", "");
    }
    setSchoolPickerInputValue(value);
  };

  const onFormSubmit = async (data: OnboardingFormProps) => {
    // TODO: something with this data
    console.log("onboarding form values: ", data);
  };

  return (
    <OakFlex
      $flexDirection="column"
      $width="all-spacing-21"
      $gap="space-between-m"
    >
      <OakFlex
        $flexDirection="column"
        $alignItems="flex-start"
        $gap="all-spacing-8"
        $pa="inner-padding-xl3"
        $dropShadow="drop-shadow-standard"
        $borderRadius="border-radius-s"
        as="form"
        onSubmit={
          (event) => void handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
        }
      >
        <Logo height={48} width={104} variant="with text" />
        <OakHeading tag="h2" $font="heading-light-5">
          Select your school
        </OakHeading>
        <ResourcePageSchoolPicker
          hasError={formState.errors?.school !== undefined}
          schoolPickerInputValue={schoolPickerInputValue}
          setSchoolPickerInputValue={onSchoolPickerInputChange}
          schools={schools}
          label={"School"}
          setSelectedSchool={setSelectedSchool}
          required={true}
          withHomeschool={false}
        />
        <OakPrimaryButton
          disabled={
            formState.errors?.school !== undefined || !formState.isValid
          }
          width="100%"
          type="submit"
        >
          Continue
        </OakPrimaryButton>
      </OakFlex>

      <OakP $font="body-2" color="text-primary" $textAlign="center">
        By continuing you agree to{" "}
        <OwaLink
          page="legal"
          legalSlug="terms-and-conditions"
          $isInline
          htmlAnchorProps={{
            target: "_blank",
            "aria-label": `Terms and conditions (opens in a new tab)"
          }`,
          }}
        >
          Oak's terms & conditions
        </OwaLink>{" "}
        and{" "}
        <OwaLink
          page="legal"
          legalSlug="privacy-policy"
          $isInline
          htmlAnchorProps={{
            target: "_blank",
            "aria-label": "Privacy policy (opens in a new tab)",
          }}
        >
          privacy policy
        </OwaLink>
        .
      </OakP>
      <OakP $font="body-2" color="text-primary" $textAlign="center">
        Need help?{" "}
        <OwaLink
          page="contact"
          $isInline
          htmlAnchorProps={{
            target: "_blank",
            "aria-label": `Contact us (opens in a new tab)"
          }`,
          }}
        >
          {" "}
          Contact us
        </OwaLink>
        .
      </OakP>
    </OakFlex>
  );
};

export default OnboardingView;
