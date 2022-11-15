import { PortableTextComponents } from "@portabletext/react";

import Circle from "../../../Circle";
import Flex from "../../../Flex";
import Icon from "../../../Icon";
import { LI, UL } from "../../../Typography";

export const ULTick: PortableTextComponents = {
  list: {
    bullet: ({ children }) => (
      <UL $mt={36} $ml={0} $pa={0}>
        {children}
      </UL>
    ),
  },

  listItem: {
    bullet: (props) => {
      const listItemText = props?.value?.children[0]?.text;

      return (
        <Flex $mb={44} $alignItems={"center"}>
          <Circle $mr={24} size={36} $background={"white"}>
            <Icon size={28} name={"Tick"} />
          </Circle>
          <LI listStyle={"none"} $font={"heading-7"}>
            {listItemText}
          </LI>
        </Flex>
      );
    },
  },
};
