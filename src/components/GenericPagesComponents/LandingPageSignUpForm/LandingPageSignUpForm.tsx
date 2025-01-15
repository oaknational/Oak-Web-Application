import { FC, useId } from "react";
import { OakBox } from "@oaknational/oak-components";

import NewsletterForm, { useNewsletterForm } from "../NewsletterForm";

import Card from "@/components/SharedComponents/Card";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";

export const LandingPageSignUpForm: FC<{
  formTitle: string;
  dontDescribe?: boolean;
}> = ({ formTitle, dontDescribe }) => {
  const { onSubmit } = useNewsletterForm();
  const id = useId();
  const descriptionId = `${id}-newsletter-form-description`;
  return (
    <Card
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
      <OakBox $mt="space-between-xs">
        <NewsletterForm
          onSubmit={onSubmit}
          id={id}
          descriptionId={dontDescribe ? undefined : descriptionId}
        />
      </OakBox>
    </Card>
  );
};
