import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  OakBox,
  OakBoxProps,
  OakFieldError,
  OakFlex,
  OakJauntyAngleLabel,
  OakOption,
  OakP,
  OakPrimaryButton,
  OakSelect,
} from "@oaknational/oak-components";
import { zodResolver } from "@hookform/resolvers/zod";

import OakError from "@/errors/OakError";
import errorReporter from "@/common-lib/error-reporter";
import { createEmailSchema } from "@/common-lib/forms/emailSchema";
import {
  USER_ROLES,
  UserRole,
} from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import { OakInputWithLabel } from "@/components/SharedComponents/OakInputWithLabel/OakInputWithLabel";

const reportError = errorReporter("NewsletterForm.tsx");

const emailSchema = createEmailSchema({
  emptyField: "Enter an email",
  invalidField: "Enter a valid email",
});

const schema = z.object({
  name: z
    .string()
    .min(1, {
      error: "Enter a name",
    })
    .max(60, "Name must contain fewer than 60 characters"),
  email: emailSchema,
  userRole: z.union([z.enum(USER_ROLES), z.literal("")]),
});

const userTypeLabelMap: Record<UserRole, string> = {
  Teacher: "Teacher",
  Parent: "Parent",
  Student: "Pupil",
  Other: "Other",
};
/**
 * The form endpoint only allows specific case-sensitive values for user-type:
 * Teacher, Parent, Pupil, Other
 */
const userTypeOptions = USER_ROLES.map((userRole) => ({
  value: userRole,
  label: userTypeLabelMap[userRole],
}));

type NewsletterFormValues = z.infer<typeof schema>;
export type NewsletterFormProps = OakBoxProps & {
  onSubmit: (values: NewsletterFormValues) => Promise<string | void>;
  id: string;
  descriptionId?: string;
};
/**
 * Newsletter Form is a styled sign-up form for the newsletter.
 *
 * ## Usage
 * Submitting this form will send data to Hubspot.
 */
const NewsletterForm: FC<NewsletterFormProps> = ({
  id,
  descriptionId,
  onSubmit,
  ...boxProps
}) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: { name: "", email: "", userRole: "" },
  });

  return (
    <OakFlex
      as="form"
      noValidate
      aria-describedby={descriptionId}
      $flexDirection="column"
      onSubmit={handleSubmit(async (values) => {
        setLoading(true);
        setSubmitError("");
        setSuccessMessage("");
        try {
          const message = await onSubmit(values);
          setSuccessMessage(message || "Thanks, that's been received!");
        } catch (error) {
          if (error instanceof OakError) {
            setSubmitError(error.message);
          } else {
            reportError(error);
            setSubmitError("An unknown error occurred");
          }
        } finally {
          setLoading(false);
        }
      })}
      $width={"100%"}
      {...boxProps}
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <OakBox
            $width="100%"
            $mb={fieldState.error ? "spacing-8" : "spacing-48"}
          >
            <OakInputWithLabel
              id={`${id}-newsletter-signup-name`}
              label="Name"
              required
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="Anna Smith"
              autocomplete="name"
              error={fieldState.error?.message}
            />
          </OakBox>
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <OakBox
            $width="100%"
            $mb={fieldState.error ? "spacing-8" : "spacing-48"}
          >
            <OakInputWithLabel
              id={`${id}-newsletter-signup-email`}
              label="Email"
              required
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="anna@amail.com"
              autocomplete="email"
              error={fieldState.error?.message}
            />
          </OakBox>
        )}
      />
      <Controller
        name="userRole"
        control={control}
        render={({ field, fieldState }) => (
          <OakBox
            $position="relative"
            $width="100%"
            $mt={errors.email ? "spacing-32" : "spacing-14"}
            $mb="spacing-8"
            role="group"
            aria-labelledby={`${id}-role-label`}
            aria-describedby={fieldState.error ? `${id}-role-error` : undefined}
          >
            <OakJauntyAngleLabel
              id={`${id}-role-label`}
              htmlFor={`${id}-newsletter-signup-userrole`}
              label="Role"
              $color={fieldState.error ? "text-inverted" : "text-primary"}
              $background={
                fieldState.error ? "bg-error" : "bg-decorative5-main"
              }
              $font="heading-7"
              $position="absolute"
              $top="-20px"
              $left="spacing-8"
              $zIndex="in-front"
              $borderRadius="border-radius-square"
            />
            <OakSelect
              id={`${id}-newsletter-signup-userrole`}
              name={field.name}
              aria-labelledby={`${id}-role-label`}
              $display="block"
              value={field.value}
              validity={fieldState.error ? "invalid" : undefined}
              onChange={(event) => {
                field.onChange(event.currentTarget.value);
              }}
            >
              <OakOption asDefault value="" disabled>
                What describes you best?
              </OakOption>
              {userTypeOptions.map((option) => (
                <OakOption key={option.value} value={option.value}>
                  {option.label}
                </OakOption>
              ))}
            </OakSelect>
            {fieldState.error && (
              <OakBox id={`${id}-role-error`} role="alert" $mt="spacing-8">
                <OakFieldError>{fieldState.error.message}</OakFieldError>
              </OakBox>
            )}
          </OakBox>
        )}
      />
      <OakPrimaryButton
        $mt="spacing-0"
        type="submit"
        width="100%"
        isLoading={loading}
      >
        Sign up to the newsletter
      </OakPrimaryButton>
      <OakP
        $mt={!submitError && successMessage ? "spacing-16" : "spacing-0"}
        $font={"body-3"}
        aria-live="assertive"
        role="alert"
        $color="text-error"
      >
        {submitError}
      </OakP>
      <OakP
        $mt={!submitError && successMessage ? "spacing-16" : "spacing-0"}
        $font={"body-3"}
        aria-live="polite"
      >
        {!submitError && successMessage}
      </OakP>
    </OakFlex>
  );
};

export default NewsletterForm;
