"use client";

import { z } from "zod";
import { OakBox, OakFlex, OakLink, OakP } from "@oaknational/oak-components";

import { createEmailSchema } from "@/common-lib/forms/emailSchema";
import { USER_ROLES } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import { resolveOakHref } from "@/common-lib/urls";
import NewsletterForm from "@/components/GenericPagesComponents/NewsletterForm";

const _schema = z.object({
  name: z
    .string()
    .min(1, "Enter a name")
    .max(60, "Name must contain fewer than 60 characters"),
  email: createEmailSchema({
    emptyField: "Enter an email",
    invalidField: "Enter a valid email",
  }),
  userRole: z.union([z.enum(USER_ROLES), z.literal("")]),
});

type FormValues = z.infer<typeof _schema>;

type TeachWithOakNewsletterFormProps = {
  id: string;
  onSubmit: (values: FormValues) => Promise<string | void>;
};

const TeachWithOakNewsletterForm = ({
  id,
  onSubmit,
}: TeachWithOakNewsletterFormProps) => {
  return (
    <OakBox
      $background="bg-decorative1-subdued"
      $position="relative"
      $pa="spacing-56"
    >
      <NewGutterMaxWidth>
        <OakFlex
          $flexDirection={["column", "row"]}
          $pa="spacing-40"
          $background="bg-primary"
          $borderRadius="border-radius-m"
        >
          <OakFlex
            $flexDirection="column"
            $pb={["spacing-48", "spacing-0"]}
            $pr={["spacing-0", "spacing-24"]}
          >
            <CardTitle icon="magic-carpet" iconSize="spacing-48" tag={"h2"}>
              Don't miss out
            </CardTitle>
            <OakP>
              Join over 100k teachers and get free resources and other helpful
              content by email. Unsubscribe at any time. Read our{" "}
              <OakLink
                href={resolveOakHref({
                  page: "legal",
                  legalSlug: "privacy-policy",
                })}
              >
                privacy policy
              </OakLink>
              .
            </OakP>
          </OakFlex>
          <NewsletterForm id={id} onSubmit={onSubmit} />
        </OakFlex>
      </NewGutterMaxWidth>
    </OakBox>
  );
};

export default TeachWithOakNewsletterForm;
