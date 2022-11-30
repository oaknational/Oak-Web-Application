import { PortableText } from "@portabletext/react";
import { FC } from "react";

import {
  HubspotFormWrapper,
  PortableTextJSON,
} from "../../../common-lib/cms-types";
import Grid, { GridArea } from "../../Grid";
import Typography, { Heading } from "../../Typography";

import { SignUpForm } from "./SignUpForm";

export const SignupPrompt: FC<{
  title: string;
  form: HubspotFormWrapper;
  bodyPortableText: PortableTextJSON;
}> = ({ title, bodyPortableText, form }) => {
  return (
    <>
      <Grid $mb={[120, 92]} $cg={[8]}>
        <GridArea
          $colSpan={[12, 5]}
          $colStart={[1, 2]}
          $width={"100%"}
          $alignItems={"flex-start"}
          $justifyContent={"center"}
          $flexDirection={"column"}
          $ph={[16, 0]}
          $mb={[56, 0]}
        >
          <Heading $font={["heading-4", "heading-5"]} tag={"h4"} $mb={[32]}>
            {title}
          </Heading>
          <Typography $font={["body-2", "body-1"]}>
            <PortableText value={bodyPortableText} />
          </Typography>
        </GridArea>
        <GridArea $colSpan={[12, 4]} $colStart={[1, 7]}>
          <SignUpForm formTitle={form.title} />
        </GridArea>
      </Grid>
    </>
  );
};
