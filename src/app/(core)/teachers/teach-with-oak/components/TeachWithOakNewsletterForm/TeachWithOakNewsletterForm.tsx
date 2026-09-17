"use client";

import { OakBox, OakFlex, OakLink, OakP } from "@oaknational/oak-components";

import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import { resolveOakHref } from "@/common-lib/urls";
import NewsletterForm, {
  NewsletterFormProps,
} from "@/components/GenericPagesComponents/NewsletterForm";

type FormValues = Parameters<NewsletterFormProps["onSubmit"]>[0];

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
              Join over 200k teachers and get free resources and other helpful
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
