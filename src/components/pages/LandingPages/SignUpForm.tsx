import { FC } from "react";

import Card from "../../Card";
import Box from "../../Box";
import AnchorTarget from "../../AnchorTarget";
import CardTitle from "../../Card/CardComponents/CardTitle";
import { anchorMap } from "../../../utils/portableText/resolveInternalHref";
import { HubspotFormWrapper } from "../../../common-lib/cms-types";
import HubspotForm from "../../Forms/HubspotForm";

type SignUpFormProps = HubspotFormWrapper;

export const SignUpForm: FC<SignUpFormProps> = ({ title, hubspotForm }) => {
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

      <CardTitle icon="MagicCarpet" $font={["heading-5", "heading-6"]} tag="h3">
        {title}
      </CardTitle>
      <Box $mt={12}>
        <HubspotForm form={hubspotForm} />
      </Box>
    </Card>
  );
};
