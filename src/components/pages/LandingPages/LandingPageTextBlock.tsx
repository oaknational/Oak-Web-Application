import { PortableText } from "@portabletext/react";
import { FC } from "react";

import { PortableTextJSON } from "../../../node-lib/cms";
import Flex from "../../Flex";
import Typography from "../../Typography";

export const LandingPageTextBlock: FC<{
  bodyPortableText: PortableTextJSON;
}> = (props) => {
  return (
    <Flex $ph={[16]} $justifyContent={"center"} $mb={[56, 92]}>
      <Typography $maxWidth={720} $font={["body-2", "body-1"]}>
        <PortableText value={props.bodyPortableText} />
      </Typography>
    </Flex>
  );
};
