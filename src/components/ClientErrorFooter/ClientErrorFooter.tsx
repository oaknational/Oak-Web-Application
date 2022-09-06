import { FC } from "react";

import Flex from "../Flex";
import SocialButtons from "../SocialButtons";
import { P } from "../Typography";

const ClientErrorFooter: FC = () => {
  return (
    <Flex $ph={16} $mb={12} $mt={64} $width={"100%"}>
      <SocialButtons />
      <Flex $alignItems={"center"}>
        <P $lineHeight={"16px"} $textAlign="center" $fontSize={[12, 16]}>
          © Oak National Academy
        </P>
      </Flex>
    </Flex>
  );
};

export default ClientErrorFooter;
