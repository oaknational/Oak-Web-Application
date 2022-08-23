import { FC, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Card, { CardProps } from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import Input from "../../Input";
import { P } from "../../Typography";
import Button from "../../Button";
import OakError from "../../../errors/OakError";
import DropdownSelect from "../../DropdownSelect";
import {
  UserRole,
  USER_ROLES,
} from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: "Name can't be empty" })
    .max(60, "Name must contain fewer than 60 charaters"),
  email: z
    .string()
    .nonempty({
      message: "Email can't be empty",
    })
    .email({
      message: "Email not valid",
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
type NewsletterFormProps = {
  onSubmit: (values: NewsletterFormValues) => Promise<string | void>;
  containerProps?: CardProps;
};
/**
 * Newsletter Form is a styled sign-up form for the newsletter.
 *
 * ## Usage
 * Submitting this form will send data to Hubspot.
 */
const NewsletterForm: FC<NewsletterFormProps> = (props) => {
  const { onSubmit, containerProps } = props;
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState } = useForm<NewsletterFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { errors } = formState;

  const descriptionId = "newsletter-form-description";

  return (
    <Card $borderRadius={0} $background="white" {...containerProps}>
      <CardTitle tag="h2" icon="MagicCarpet" iconSize={56}>
        Don’t miss out
      </CardTitle>
      <P color={"black"} id={descriptionId}>
        Join 80,000 teachers and get free lessons, resources and other helpful
        content by email. Unsubscribe at any time. Read our{" "}
        <Link href="/">
          <a>privacy policy</a>
        </Link>
        .
      </P>
      <form
        onSubmit={handleSubmit(async (data) => {
          setLoading(true);
          setError("");
          setSuccessMessage("");
          try {
            const successMessage = await onSubmit(data);
            setSuccessMessage(
              successMessage || "Thanks, that's been received!"
            );
          } catch (error) {
            if (error instanceof OakError) {
              setError(error.message);
            } else {
              // @todo bugsnag
              setError("An unknown error occurred");
            }
          } finally {
            setLoading(false);
          }
        })}
        aria-describedby={descriptionId}
      >
        <Input
          id="newsletter-signup-name"
          $mt={24}
          placeholder="Name"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          id="newsletter-signup-email"
          $mt={24}
          placeholder="Email Address"
          {...register("email")}
          error={errors.email?.message}
        />
        <DropdownSelect
          id="newsletter-signup-userrole"
          $mt={24}
          label="User type"
          placeholder="What describes you best?"
          listItems={userTypeOptions}
          {...register("userRole")}
          error={errors.userRole?.message}
        />
        <Button
          $mt={24}
          label="Sign Up"
          fullWidth
          htmlButtonProps={{ disabled: loading }}
          background="teachersHighlight"
        />
        <P
          $mt={error ? 12 : 0}
          $fontSize={14}
          aria-live="assertive"
          role="alert"
          $color="failure"
        >
          {error}
        </P>
        {!error && successMessage && (
          <P $mt={12} $fontSize={14}>
            {successMessage}
          </P>
        )}
      </form>
    </Card>
  );
};

export default NewsletterForm;
