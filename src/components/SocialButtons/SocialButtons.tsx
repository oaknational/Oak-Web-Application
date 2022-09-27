import { FC } from "react";

import IconButtonAsLink from "../Button/IconButtonAsLink";
import Flex from "../Flex";

const SocialButtons: FC = () => {
  return (
    <Flex $alignItems={"center"} $justifyContent={"center"}>
      <IconButtonAsLink
        aria-label={"instagram"}
        icon={"Instagram"}
        href={"https://instagram.com/oaknational"}
        variant={"minimal"}
        $mr={16}
        size={"small"}
      />
      <IconButtonAsLink
        aria-label={"facebook"}
        icon={"Facebook"}
        href={"https://facebook.com/oaknationalacademy"}
        variant={"minimal"}
        $mr={16}
        size={"small"}
      />
      <IconButtonAsLink
        aria-label={"twitter"}
        icon={"Twitter"}
        href={"https://twitter.com/oaknational"}
        variant={"minimal"}
        $mr={16}
        size={"small"}
      />
      <IconButtonAsLink
        aria-label={"LinkedIn"}
        icon={"LinkedIn"}
        href={"https://www.linkedin.com/company/oak-national-academy/"}
        variant={"minimal"}
        $mr={[12, 32]}
        size={"small"}
      />
    </Flex>
  );
};

export default SocialButtons;
