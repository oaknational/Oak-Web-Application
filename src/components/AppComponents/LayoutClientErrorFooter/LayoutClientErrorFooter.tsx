import { FC } from "react";
import { OakP, OakFlex } from "@oaknational/oak-components";

import SocialButtons, {
  OAK_SOCIALS,
} from "@/components/SharedComponents/SocialButtons";

const LayoutClientErrorFooter: FC = () => {
  return (
    <OakFlex $ph="spacing-16" $mb="spacing-12" $mt="spacing-56" $width={"100%"}>
      <SocialButtons for="Oak National Academy" {...OAK_SOCIALS} />
      <OakFlex $alignItems={"center"} $ml={["spacing-16"]}>
        <OakP $textAlign="center" $font={["body-4", "body-2"]}>
          © Oak National Academy
        </OakP>
      </OakFlex>
    </OakFlex>
  );
};

export default LayoutClientErrorFooter;
