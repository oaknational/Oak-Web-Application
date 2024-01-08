import { FC } from "react";

import { OAK_SOCIALS } from "../SharedComponents/SocialButtons/SocialButtons";

import SocialButtons from "@/components/SharedComponents/SocialButtons";
import { P } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";

const ClientErrorFooter: FC = () => {
  return (
    <Flex $ph={16} $mb={12} $mt={64} $width={"100%"}>
      <SocialButtons for="Oak National Academy" {...OAK_SOCIALS} />
      <Flex $alignItems={"center"} $ml={[16]}>
        <P $textAlign="center" $font={["body-4", "body-2"]}>
          © Oak National Academy
        </P>
      </Flex>
    </Flex>
  );
};

export default ClientErrorFooter;
