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
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SUBJECTS } from "./formData";
import type { NcAlignmentCheckerSubjectPickerFormValues } from "./SubjectPickerForm.schema";
import { ncAlignmentCheckerSubjectPickerFormValuesSchema } from "./SubjectPickerForm.schema";

import type { SubjectPicker as SubjectPickerFormProps } from "@/common-lib/cms-types";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

export default function SubjectPickerForm({
  title,
  tag,
  bannerLabel,
  buttonText,
}: Readonly<SubjectPickerFormProps>) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const id = useId();
  const subjectErrorId = `${id}-subject-error`;
  const yearOrKeyStageErrorId = `${id}-year-or-key-stage-error`;

  const { formState, control, handleSubmit, watch, clearErrors, setValue } =
    useForm({
      resolver: zodResolver(ncAlignmentCheckerSubjectPickerFormValuesSchema),
      defaultValues: {
        subjectSlug: "",
        yearOrKeyStageSlug: "",
      },
    });

  const selectedSubjectSlug = watch("subjectSlug");
  const selectedSubject = SUBJECTS.find((s) => s.slug === selectedSubjectSlug);

  const onFormSubmit = (data: NcAlignmentCheckerSubjectPickerFormValues) => {
    setIsNavigating(true);
    router.push(
      `/nc-alignment-checker/${data.subjectSlug}/${data.yearOrKeyStageSlug}`,
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
          render={({ field, fieldState }) => (
            <>
              {fieldState.error?.message && (
                <OakBox id={subjectErrorId} $mb="spacing-8">
                  <OakFieldError>{fieldState.error.message}</OakFieldError>
                </OakBox>
              )}
              <OakRadioGroup
                name={field.name}
                aria-describedby={
                  fieldState.error?.message ? subjectErrorId : undefined
                }
                aria-invalid={fieldState.invalid || undefined}
                label="Choose your primary subject"
                $font={["heading-7", "heading-6"]}
                $gap="spacing-16"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  clearErrors("yearOrKeyStageSlug");
                  setValue("yearOrKeyStageSlug", "");
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
              name="yearOrKeyStageSlug"
              render={({ field, fieldState }) => (
                <>
                  {fieldState.error?.message && (
                    <OakBox id={yearOrKeyStageErrorId} $mb="spacing-8">
                      <OakFieldError>{fieldState.error.message}</OakFieldError>
                    </OakBox>
                  )}
                  <OakRadioGroup
                    name={field.name}
                    aria-describedby={
                      fieldState.error?.message
                        ? yearOrKeyStageErrorId
                        : undefined
                    }
                    aria-invalid={fieldState.invalid || undefined}
                    label={`Choose your ${selectedSubject?.yearOrKeyStageQuestion.noun}`}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <OakFlex $flexWrap="wrap" $gap="spacing-8">
                      {selectedSubject?.yearOrKeyStageQuestion.options.map(
                        (option) => (
                          <OakRadioAsButton
                            value={option.slug}
                            displayValue={option.title}
                            key={option.slug}
                          />
                        ),
                      )}
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
              formState.errors.yearOrKeyStageSlug?.message}
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
