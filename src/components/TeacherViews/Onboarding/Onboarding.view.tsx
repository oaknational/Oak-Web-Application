import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakInlineBanner,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";

import { onboardUser } from "./onboardingActions";

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
  const { formState, setValue, handleSubmit, setError } =
    useForm<OnboardingFormProps>({
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
  const router = useRouter();

  const onSchoolPickerInputChange = (value: React.SetStateAction<string>) => {
    if (value === "") {
      setSchoolDetailsInForm("", "");
    }
    setSchoolPickerInputValue(value);
  };

  const onFormSubmit = async (data: OnboardingFormProps) => {
    try {
      // TODO: something with this data
      console.log("onboarding form values: ", data);

      await onboardUser();

      // Log the user in again (without a prompt) so that their
      // id and access tokens are updated with their onboarding status
      router.replace({
        pathname: "/api/auth/silent-login",
        query: { returnTo: router.query.returnTo?.toString() },
      });
    } catch (error) {
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
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
        {formState.errors?.root && (
          <OakInlineBanner
            isOpen
            icon="error"
            type="error"
            message={formState.errors.root.message}
            $width="100%"
          />
        )}
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
