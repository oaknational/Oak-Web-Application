import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Input from "../../Input";
import OakError from "../../../errors/OakError";
import DropdownSelect from "../../DropdownSelect";
import errorReporter from "../../../common-lib/error-reporter";
import Form from "../Form";
import { BoxProps } from "../../SharedComponents/Box";
import {
  USER_ROLES,
  UserRole,
} from "../../../browser-lib/hubspot/forms/getHubspotFormPayloads";

import { P } from "@/components/SharedComponents/Typography";
import Button from "@/components/SharedComponents/Button";

const reportError = errorReporter("NewsletterForm.tsx");

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Enter a name" })
    .max(60, "Name must contain fewer than 60 charaters"),
  email: z
    .string()
    .min(1, {
      message: "Enter an email",
    })
    .email({
      message: "Enter a valid email",
    }),
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
export type NewsletterFormProps = BoxProps & {
  onSubmit: (values: NewsletterFormValues) => Promise<string | void>;
  id: string;
  descriptionId: string;
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
  const [error, setError] = useState("");
  const { register, handleSubmit, formState } = useForm<NewsletterFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { errors } = formState;

  return (
    <Form
      onSubmit={handleSubmit(async (data) => {
        setLoading(true);
        setError("");
        setSuccessMessage("");
        try {
          const successMessage = await onSubmit(data);
          setSuccessMessage(successMessage || "Thanks, that's been received!");
        } catch (error) {
          if (error instanceof OakError) {
            setError(error.message);
          } else {
            reportError(error);
            setError("An unknown error occurred");
          }
        } finally {
          setLoading(false);
        }
      })}
      aria-describedby={descriptionId}
      $width={"100%"}
      {...boxProps}
    >
      <Input
        id={`${id}-newsletter-signup-name`}
        label="Name"
        placeholder="Anna Smith"
        required={true}
        isRequired={true}
        autoComplete="name"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        id={`${id}-newsletter-signup-email`}
        label="Email"
        autoComplete="email"
        required={true}
        isRequired={true}
        placeholder="anna@amail.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <DropdownSelect
        id={`${id}-newsletter-signup-userrole`}
        $mt={32}
        label="Role"
        placeholder="What describes you best?"
        listItems={userTypeOptions}
        {...register("userRole")}
        error={errors.userRole?.message}
      />
      <Button
        $mt={24}
        label="Sign up to the newsletter"
        $fullWidth
        htmlButtonProps={{ disabled: loading }}
        background="black"
      />
      <P
        $mt={error ? 16 : 0}
        $font={"body-3"}
        aria-live="assertive"
        role="alert"
        $color="red"
      >
        {error}
      </P>
      <P
        $mt={!error && successMessage ? 16 : 0}
        $font={"body-3"}
        aria-live="polite"
      >
        {!error && successMessage}
      </P>
    </Form>
  );
};

export default NewsletterForm;
