import { FC } from "react";
import { OakGrid, OakGridArea } from "@oak-academy/oak-components";

import { LandingPageSignUpForm } from "@/components/GenericPagesComponents/LandingPageSignUpForm";
import { PortableTextJSON } from "@/common-lib/cms-types";
import Typography, { Heading } from "@/components/SharedComponents/Typography";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

export const LandingPageSignupPrompt: FC<{
  title: string;
  form: { title: string };
  bodyPortableText: PortableTextJSON;
}> = ({ title, bodyPortableText, form }) => {
  return (
    <>
      <OakGrid $mb={["space-between-xxxl"]} $cg={["all-spacing-2"]}>
        <OakGridArea
          $colSpan={[12, 5]}
          $colStart={[1, 2]}
          $width={"100%"}
          $alignItems={"flex-start"}
          $justifyContent={"center"}
          $flexDirection={"column"}
          $ph={["inner-padding-m", "inner-padding-none"]}
          $mb={["space-between-xl", "space-between-none"]}
        >
          <Heading $font={["heading-4", "heading-5"]} tag={"h4"} $mb={[32]}>
            {title}
          </Heading>
          <Typography $font={["body-2", "body-1"]}>
            <PortableTextWithDefaults value={bodyPortableText} />
          </Typography>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 4]} $colStart={[1, 7]}>
          <LandingPageSignUpForm formTitle={form.title} />
        </OakGridArea>
      </OakGrid>
    </>
  );
};
