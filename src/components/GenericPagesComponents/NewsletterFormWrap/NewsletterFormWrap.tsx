import { FC, useId } from "react";
import {
  OakGrid,
  OakGridArea,
  OakLink,
  OakP,
} from "@oaknational/oak-components";

import NewsletterForm, {
  NewsletterFormProps,
} from "@/components/GenericPagesComponents/NewsletterForm";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import Card, { CardProps } from "@/components/SharedComponents/Card";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import { resolveOakHref } from "@/common-lib/urls";

/**
 * Newsletter Form wrapper adds copy around around NewsletterForm.
 *
 * ## Usage
 * Submitting this form will send data to Hubspot.
 */

type NewsletterFormWrapProps = {
  containerProps?: CardProps;
  anchorTargetId?: string;
  desktopColSpan?: 12 | 6;
} & Pick<NewsletterFormProps, "onSubmit">;

const NewsletterFormWrap: FC<NewsletterFormWrapProps> = (props) => {
  const { containerProps, anchorTargetId, desktopColSpan = 12 } = props;

  const id = useId();
  const descriptionId = `${id}-newsletter-form-description`;
  return (
    <Card
      $ph={"spacing-24"}
      $pv={["spacing-24", desktopColSpan === 12 ? "spacing-24" : "spacing-40"]}
      $borderRadius={"border-radius-xs"}
      $background="bg-primary"
      {...containerProps}
    >
      {anchorTargetId && <AnchorTarget id={anchorTargetId} />}
      <OakGrid>
        <OakGridArea $colSpan={[12, desktopColSpan]}>
          <CardTitle tag="h2" icon="magic-carpet" iconSize={"spacing-56"}>
            Don’t miss out
          </CardTitle>
          <OakP
            $mr={[
              "spacing-0",
              desktopColSpan === 6 ? "spacing-24" : "spacing-0",
            ]}
            $mb="spacing-24"
            color={"text-primary"}
            id={descriptionId}
          >
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
        </OakGridArea>
        <OakGridArea $colSpan={[12, desktopColSpan]} $mt={"spacing-12"}>
          <NewsletterForm descriptionId={descriptionId} id={id} {...props} />
        </OakGridArea>
      </OakGrid>
    </Card>
  );
};

export default NewsletterFormWrap;
