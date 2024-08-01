import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import getPageProps from "@/node-lib/getPageProps";
import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";
import ResourcePageSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

export const onboardingFormSchema = z.object({
  school: z
    .string({
      errorMap: () => ({
        message:
          "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
      }),
    })
    .min(
      1,
      "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
    ),
  schoolName: z.string().optional(),
});
export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
export type OnboardingFormProps = OnboardingFormValues & {
  onSubmit: (values: OnboardingFormValues) => Promise<string | void>;
};

const OnboardingPage: NextPage = () => {
  const ffEnabled = useFeatureFlagEnabled("use-auth-owa");
  const router = useRouter();

  useEffect(() => {
    if (ffEnabled === false) {
      router.replace("/404");
    }
  }, [ffEnabled, router]);

  const { formState, setValue, handleSubmit } = useForm<OnboardingFormProps>({
    resolver: zodResolver(onboardingFormSchema),
    mode: "onBlur",
  });

  const setSchool = useCallback(
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
  } = useSchoolPicker();

  useEffect(() => {
    if (selectedSchool && schoolPickerInputValue !== "") {
      setSchool(selectedSchool.toString(), schoolPickerInputValue);
    }
  }, [selectedSchool, schoolPickerInputValue, setSchool]);

  const onFormSubmit = async (data: OnboardingFormProps) => {
    // TODO: something with this data
    console.log("onboarding form values", data);
  };

  return ffEnabled ? (
    <AppLayout
      seoProps={{ ...getSeoProps({}), ...{ noFollow: true, noIndex: true } }}
      $background="white"
    >
      <OakFlex $flexDirection="column" $gap="all-spacing-10">
        <OakHeading tag="h1">Onboarding</OakHeading>
        <ResourcePageSchoolPicker
          hasError={formState.errors?.school !== undefined}
          schoolPickerInputValue={schoolPickerInputValue}
          setSchoolPickerInputValue={setSchoolPickerInputValue}
          schools={schools}
          label={"School"}
          setSelectedSchool={setSelectedSchool}
          required={true}
        />
        <OakPrimaryButton
          onClick={
            (event) => void handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
          }
          disabled={
            formState.errors?.school !== undefined || !formState.isValid
          }
        >
          Continue
        </OakPrimaryButton>
      </OakFlex>
    </AppLayout>
  ) : null;
};

export const getStaticProps: GetStaticProps = async (context) => {
  return getPageProps({
    page: "onboarding-page::getStaticProps",
    context,
    getProps: async () => {
      return {
        props: {},
      };
    },
  });
};

export default OnboardingPage;
