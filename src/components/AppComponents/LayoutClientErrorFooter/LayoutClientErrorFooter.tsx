import { FC } from "react";
import { OakP } from "@oaknational/oak-components";

import SocialButtons, {
  OAK_SOCIALS,
} from "@/components/SharedComponents/SocialButtons";
import Flex from "@/components/SharedComponents/Flex";

const LayoutClientErrorFooter: FC = () => {
  return (
    <Flex $ph={16} $mb={12} $mt={64} $width={"100%"}>
      <SocialButtons for="Oak National Academy" {...OAK_SOCIALS} />
      <Flex $alignItems={"center"} $ml={[16]}>
        <OakP $textAlign="center" $font={["body-4", "body-2"]}>
          © Oak National Academy
        </OakP>
      </Flex>
    </Flex>
  );
};

export default LayoutClientErrorFooter;
