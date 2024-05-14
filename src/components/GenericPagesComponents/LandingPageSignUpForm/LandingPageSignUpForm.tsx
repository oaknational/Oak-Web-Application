import { FC, useId } from "react";

import NewsletterForm, { useNewsletterForm } from "../NewsletterForm";

import Card from "@/components/SharedComponents/Card";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import Box from "@/components/SharedComponents/Box";

export const LandingPageSignUpForm: FC<{ formTitle: string }> = ({
  formTitle,
}) => {
  const { onSubmit } = useNewsletterForm();
  const id = useId();
  const descriptionId = `${id}-newsletter-form-description`;
  return (
    <Card
      // $ml={[0, 48]}
      $width={["100%"]}
      $pv={40}
      $ph={[16, 24]}
      $background={"white"}
      $dropShadow={"notificationCard"}
    >
      {/**
       * We previously constrained editors to a pre-set list of possible anchors
       * within the CMS, although "formBlock" was the only option. Now that editors
       * can select any, we have this redundancy to avoid the need to map
       * "formBlock"->"form-block" until all instances are updated in the CMS
       */}
      <AnchorTarget id={"formBlock"} />
      <AnchorTarget id={"form-block"} />

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
