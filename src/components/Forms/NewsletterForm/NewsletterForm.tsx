import { FC, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Card from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import Input from "../../Input";
import { P } from "../../Typography";
import Button from "../../Button";

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: "Name can't be empty" })
    .max(60, "Name must contain few than 60 charaters"),
  email: z
    .string()
    .nonempty({
      message: "Email can't be empty",
    })
    .email({
      message: "Email not valid",
    }),
  userRole: z.string(),
});

type NewsletterFormValues = z.infer<typeof schema>;
type NewsletterFormProps = {
  onSubmit: (values: NewsletterFormValues) => Promise<void>;
};
/**
 * Newsletter Form is a styled sign-up form for the newsletter.
 *
 * ## Usage
 * Submitting this form will send data to Hubspot.
 */
const NewsletterForm: FC<NewsletterFormProps> = (props) => {
  const { onSubmit } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const descriptionId = "newsletter-form-description";

  return (
    <Card background="white">
      <CardTitle tag="h2" title="Join The Community" icon="PaperPlane" />
      <P id={descriptionId}>
        Be among the first to get free lessons, resources and other helpful
        content by email. Unsubscribe at any time. Our privacy policy is{" "}
        <Link href="/">
          <a>here</a>
        </Link>
        .
      </P>
      <form
        onSubmit={handleSubmit(async (data) => {
          setLoading(true);
          setError("");
          try {
            await onSubmit(data);
          } catch (error) {
            if (error instanceof Error) {
              setError(error.message);
            } else {
              // @todo bugsnag
            }
          } finally {
            setLoading(false);
          }
        })}
        aria-describedby={descriptionId}
      >
        <Input
          id="newsletter-signup-name"
          mt={24}
          placeholder="Name"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          id="newsletter-signup-email"
          mt={24}
          placeholder="Email Address"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          id="newsletter-signup-user-role"
          mt={24}
          placeholder="What describes you best?"
          {...register("userRole")}
        />
        <Button
          mt={24}
          label="Sign Up"
          fullWidth
          htmlButtonProps={{ disabled: loading }}
        />
        <P
          mt={error ? 12 : 0}
          fontSize={14}
          aria-live="assertive"
          role="alert"
          color="error"
        >
          {error}
        </P>
      </form>
    </Card>
  );
};

export default NewsletterForm;
