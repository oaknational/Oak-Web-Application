import { FC, useId } from "react";

import Card, { CardProps } from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import { P } from "../../Typography";
import AnchorTarget from "../../AnchorTarget";
import OakLink from "../../OakLink";

import NewsletterForm, { NewsletterFormProps } from "./NewsletterForm";

import Grid, { GridArea } from "@/components/Grid";

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
      <AnchorTarget id={anchorTargetId} />
      <Grid>
        <GridArea $colSpan={[12, desktopColSpan]}>
          <CardTitle tag="h2" icon="magic-carpet" iconSize={56}>
            Don’t miss out
          </CardTitle>
          <P
            $mr={[0, desktopColSpan === 6 ? 24 : 0]}
            $mb={24}
            color={"black"}
            id={descriptionId}
          >
            Join over 100k teachers and get free resources and other helpful
            content by email. Unsubscribe at any time. Read our{" "}
            <OakLink page="legal" legalSlug="privacy-policy" $isInline>
              privacy policy
            </OakLink>
            .
          </P>
        </GridArea>
        <GridArea $colSpan={[12, desktopColSpan]} $mt={12}>
          <NewsletterForm descriptionId={descriptionId} id={id} {...props} />
        </GridArea>
      </Grid>
    </Card>
  );
};

export default NewsletterFormWrap;
