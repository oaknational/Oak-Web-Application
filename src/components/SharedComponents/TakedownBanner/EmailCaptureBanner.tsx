import {
  OakInlineRegistrationBanner,
  OakHeading,
} from "@oaknational/oak-components";
import { ReactNode } from "react";

import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";

export const EmailCaptureBanner = ({
  header,
  body,
}: {
  header: string;
  body: string | ReactNode;
}) => {
  const newsletterFormProps = useNewsletterForm();
  return (
    <OakInlineRegistrationBanner
      headerText={
        <OakHeading tag="h2" $font={["heading-5", "heading-4", "heading-4"]}>
          {header}
        </OakHeading>
      }
      bodyText={body}
      onSubmit={(email) => {
        const emailPattern =
          /^[A-Z0-9._%+-]{1,64}@[A-Z0-9-]+(?:\.[A-Z0-9-]+){0,2}\.[A-Z]{2,64}$/i;
        const isValidEmail = emailPattern.test(email);
        if (!isValidEmail) {
          throw new Error("Please enter a valid email address");
        }
        return newsletterFormProps.onSubmit({
          email,
          userRole: "Teacher",
        });
      }}
    />
  );
};
