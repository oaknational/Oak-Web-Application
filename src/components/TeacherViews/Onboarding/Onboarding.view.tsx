import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
  OakCheckBox,
  OakLink,
} from "@oaknational/oak-components";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";
import ResourcePageSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import Logo from "@/components/AppComponents/Logo";
import OwaLink from "@/components/SharedComponents/OwaLink";
import ManualEntrySchoolDetails from "@/components/TeacherComponents/ManualEntrySchoolDetails";

const onboardingFormSchema = z
  .object({
    school: z
      .string({
        errorMap: () => ({
          message: "Select school",
        }),
      })
      .min(1, "Select school"),
    schoolName: z.string().optional(),
    newsletterSignUp: z.boolean(),
  })
  .or(
    z.object({
      manualSchoolName: z
        .string()
        .min(3, "School name must be at least 3 characters long"),

      schoolAddress: z
        .string()
        .min(3, "School address must be at least 3 characters long"),

      newsletterSignUp: z.boolean(),
    }),
  );

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
export type OnboardingFormProps = OnboardingFormValues & {
  onSubmit: (values: OnboardingFormValues) => Promise<void>;
};

export const OnboardingView = () => {
  const [renderManualSchoolInput, setRenderManualSchoolInput] =
    useState<boolean>(false);
  const [manualSchoolName, setManualSchoolName] = useState<string>("");
  const [manualSchoolAddress, setManualSchoolAddress] = useState<string>("");
  const { formState, setValue, handleSubmit, control, trigger, reset } =
    useForm<OnboardingFormProps>({
      resolver: zodResolver(onboardingFormSchema),
      mode: "onBlur",
      defaultValues: {
        newsletterSignUp: true,
      },
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

  const setSchoolDetailsInManualForm = useCallback(
    (manualSchoolName: string, schoolAddress: string) => {
      setValue("schoolAddress", schoolAddress, {
        shouldValidate: true,
      });
      setValue("manualSchoolName", manualSchoolName, {
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
    if (renderManualSchoolInput) {
      reset();
    }
  }, [
    selectedSchool,
    schoolPickerInputValue,
    setSchoolDetailsInForm,
    renderManualSchoolInput,
    reset,
  ]);

  const onManualSchoolInputChange = (
    manualSchoolName: string,
    schoolAddress: string,
  ) => {
    if (manualSchoolName === "" && schoolAddress === "") {
      setSchoolDetailsInManualForm("", "");
    }
    setSchoolDetailsInManualForm(manualSchoolName, schoolAddress);
  };

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

        {!renderManualSchoolInput && (
          <>
            <ResourcePageSchoolPicker
              hasError={
                !renderManualSchoolInput &&
                "school" in formState.errors &&
                formState.errors?.school !== undefined
              }
              schoolPickerInputValue={schoolPickerInputValue}
              setSchoolPickerInputValue={onSchoolPickerInputChange}
              schools={schools}
              label={"School"}
              setSelectedSchool={setSelectedSchool}
              required={true}
              withHomeschool={false}
            />
            <OakFlex $alignItems={"center"} $font={"body-2-bold"}>
              <OakP $font={"body-2"} $mr={"space-between-sssx"}>
                Can't find your school?
              </OakP>
              <OakLink
                onClick={() => {
                  setRenderManualSchoolInput(true);
                  reset();
                }}
                element="button"
              >
                Enter manually
              </OakLink>
            </OakFlex>
          </>
        )}

        {renderManualSchoolInput && (
          <ManualEntrySchoolDetails
            hasErrors={formState.errors}
            onManualSchoolInputChange={onManualSchoolInputChange}
            setValue={setValue}
            control={control}
            setRenderManualSchoolInput={setRenderManualSchoolInput}
            manualSchoolName={manualSchoolName}
            manualSchoolAddress={manualSchoolAddress}
            setManualSchoolName={setManualSchoolName}
            setManualSchoolAddress={setManualSchoolAddress}
            reset={reset}
          />
        )}
        <OakPrimaryButton
          disabled={!formState.isValid}
          width="100%"
          type="submit"
        >
          Continue
        </OakPrimaryButton>
        <Controller
          control={control}
          name="newsletterSignUp"
          render={({ field: { value, onChange, name, onBlur } }) => {
            const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
              onChange(e.target.checked);
              trigger();
            };
            return (
              <OakCheckBox
                checked={value}
                name={name}
                onBlur={onBlur}
                onChange={onChangeHandler}
                value="Sign up to receive helpful content via email. Unsubscribe at any
                    time."
                id="newsletterSignUp"
              />
            );
          }}
        />
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
