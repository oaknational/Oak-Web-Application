import { FC, useId } from "react";
import { OakGrid, OakGridArea, OakP } from "@oaknational/oak-components";

import OwaLink from "@/components/SharedComponents/OwaLink";
import NewsletterForm, {
  NewsletterFormProps,
} from "@/components/GenericPagesComponents/NewsletterForm";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import Card, { CardProps } from "@/components/SharedComponents/Card";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";

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
      $ph={24}
      $pv={[24, desktopColSpan === 12 ? 24 : 40]}
      $borderRadius={2}
      $background="white"
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
            <OwaLink page="legal" legalSlug="privacy-policy" $isInline>
              privacy policy
            </OwaLink>
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
