import { FC, ReactNode } from "react";

import Flex from "@/components/SharedComponents/Flex.deprecated";

type WrapProps = {
  children: ReactNode;
};

const OverviewAssetWrap: FC<WrapProps> = ({ children }) => {
  return (
    <Flex $mt={[0, 16]} $justifyContent={"center"} $width={"100%"}>
      <Flex
        $maxWidth={["100%", "70%", 900]}
        $width={"100%"}
        $alignItems={"center"}
        $flexDirection={"column"}
        $flexGrow={1}
      >
        {children}
      </Flex>
    </Flex>
  );
};

export default OverviewAssetWrap;
