import {
  OakBox,
  OakFlex,
  OakHeading,
  OakInlineBanner,
  OakPrimaryButton,
  OakTagFunctional,
  OakRadioAsButton,
  OakRadioGroup,
  OakFieldError,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SUBJECTS, KEY_STAGES } from "./formData";
import type { NcAlignmentCheckerSubjectPickerFormValues } from "./SubjectPickerForm.schema";
import { ncAlignmentCheckerSubjectPickerFormValuesSchema } from "./SubjectPickerForm.schema";

import type { SubjectPicker as SubjectPickerFormProps } from "@/common-lib/cms-types";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

export default function SubjectPickerForm({
  title,
  tag,
  bannerLabel,
  buttonText,
}: SubjectPickerFormProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const { formState, handleSubmit, control, watch, clearErrors } = useForm({
    resolver: zodResolver(ncAlignmentCheckerSubjectPickerFormValuesSchema),
    defaultValues: {
      subjectSlug: "",
      keyStageSlug: "",
    },
  });

  const selectedSubjectSlug = watch("subjectSlug");

  const onFormSubmit = async (
    data: NcAlignmentCheckerSubjectPickerFormValues,
  ) => {
    setIsNavigating(true);
    router.push(
      `/nc-alignment-checker/${data.subjectSlug}/${data.keyStageSlug}`,
    );
  };

  return (
    <OakFlex
      as="form"
      $borderRadius="border-radius-xl"
      $background="bg-neutral"
      $pa="spacing-24"
      $flexDirection="column"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <OakTagFunctional
        label={tag}
        $background="bg-decorative1-main"
        $mb="spacing-16"
        useSpan
        $alignSelf="flex-start"
      />
      <OakHeading tag="h2" $font={["heading-5", "heading-4"]}>
        {title}
      </OakHeading>
      <OakInlineBanner isOpen message={bannerLabel} $mt="spacing-24" />

      <OakBox $mv={["spacing-32", "spacing-48"]}>
        <Controller
          control={control}
          name="subjectSlug"
          rules={{ required: "Choose a subject to continue" }}
          render={({ field, fieldState }) => (
            <>
              {fieldState.error?.message && (
                <OakBox $mb="spacing-8">
                  <OakFieldError>{fieldState.error.message}</OakFieldError>
                </OakBox>
              )}
              <OakRadioGroup
                name={field.name}
                label="Choose your primary subject"
                $font={["heading-7", "heading-6"]}
                $gap="spacing-16"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  clearErrors("keyStageSlug");
                }}
              >
                <OakFlex $flexWrap="wrap" $gap="spacing-8">
                  {SUBJECTS.map((subject) => (
                    <OakRadioAsButton
                      variant="with-icon"
                      icon={getValidSubjectIconName(
                        subject.icon ?? subject.slug,
                      )}
                      value={subject.slug}
                      displayValue={subject.title}
                      key={subject.slug}
                    />
                  ))}
                </OakFlex>
              </OakRadioGroup>
            </>
          )}
        />

        {selectedSubjectSlug && (
          <OakBox $pt="spacing-48">
            <Controller
              control={control}
              name="keyStageSlug"
              rules={{ required: "Choose a key stage to continue" }}
              render={({ field, fieldState }) => (
                <>
                  {fieldState.error?.message && (
                    <OakBox $mb="spacing-8">
                      <OakFieldError>{fieldState.error.message}</OakFieldError>
                    </OakBox>
                  )}
                  <OakRadioGroup
                    name={field.name}
                    label="Choose your key stage"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <OakFlex $flexWrap="wrap" $gap="spacing-8">
                      {KEY_STAGES.map((keyStage) => (
                        <OakRadioAsButton
                          value={keyStage.slug}
                          displayValue={keyStage.title}
                          key={keyStage.slug}
                        />
                      ))}
                    </OakFlex>
                  </OakRadioGroup>
                </>
              )}
            />
          </OakBox>
        )}
      </OakBox>

      <OakFlex role="alert" $pb="spacing-16">
        {!formState.isValid && (
          <OakFieldError>
            {formState.errors.subjectSlug?.message ??
              formState.errors.keyStageSlug?.message}
          </OakFieldError>
        )}
      </OakFlex>

      <OakPrimaryButton
        type="submit"
        iconName="arrow-right"
        isTrailingIcon
        isLoading={!formState.isReady || isNavigating}
      >
        {buttonText}
      </OakPrimaryButton>
    </OakFlex>
  );
}
