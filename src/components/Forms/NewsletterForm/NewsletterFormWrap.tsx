import { FC, useId } from "react";

import Card, { CardProps } from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import { P } from "../../Typography";
import AnchorTarget from "../../AnchorTarget";
import OakLink from "../../OakLink";

import NewsletterForm, { NewsletterFormProps } from "./NewsletterForm";

/**
 * Newsletter Form wrapper adds copy around around NewsletterForm.
 *
 * ## Usage
 * Submitting this form will send data to Hubspot.
 */

type NewsletterFormWrapProps = {
  containerProps?: CardProps;
  anchorTargetId?: string;
} & Pick<NewsletterFormProps, "onSubmit">;

const NewsletterFormWrap: FC<NewsletterFormWrapProps> = (props) => {
  const { containerProps, anchorTargetId } = props;

  const id = useId();
  const descriptionId = `${id}-newsletter-form-description`;
  return (
    <Card
      $ph={[16, 24]}
      $borderRadius={0}
      $background="white"
      {...containerProps}
    >
      <AnchorTarget id={anchorTargetId} />
      <CardTitle tag="h2" icon="magic-carpet" iconSize={56}>
        Don’t miss out
      </CardTitle>
      <P $mb={24} color={"black"} id={descriptionId}>
        Join over 100k teachers and get free resources and other helpful content by
        email. Unsubscribe at any time. Read our{" "}
        <OakLink page="legal" legalSlug="privacy-policy" $isInline>
          privacy policy
        </OakLink>
        .
      </P>
      <NewsletterForm descriptionId={descriptionId} id={id} {...props} />
    </Card>
  );
};

export default NewsletterFormWrap;
