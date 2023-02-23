import { FC, useId } from "react";

import Card from "../../Card";
import Box from "../../Box";
import NewsletterForm, { useNewsletterForm } from "../../Forms/NewsletterForm";
import AnchorTarget from "../../AnchorTarget";
import CardTitle from "../../Card/CardComponents/CardTitle";
import { anchorMap } from "../../../utils/portableText/resolveInternalHref";

export const SignUpForm: FC<{ formTitle: string }> = ({ formTitle }) => {
  const { onSubmit } = useNewsletterForm();
  const id = useId();
  const descriptionId = `${id}-newsletter-form-description`;
  return (
    <Card
      $ml={[0, 48]}
      $width={["100%"]}
      $pv={40}
      $ph={[16, 24]}
      $background={"white"}
      $dropShadow={"notificationCard"}
    >
      <AnchorTarget id={anchorMap["formBlock"]} />

      <CardTitle
        icon="magic-carpet"
        $font={["heading-5", "heading-6"]}
        tag="h3"
      >
        {formTitle}
      </CardTitle>
      <Box $mt={12}>
        <NewsletterForm
          onSubmit={onSubmit}
          id={id}
          descriptionId={descriptionId}
        />
      </Box>
    </Card>
  );
};
