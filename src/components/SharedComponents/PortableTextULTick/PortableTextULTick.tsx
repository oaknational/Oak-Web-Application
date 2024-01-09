import { PortableTextComponents } from "@portabletext/react";

import Circle from "@/components/SharedComponents/Circle";
import Icon from "@/components/SharedComponents/Icon";
import { LI, Span, UL } from "@/components/SharedComponents/Typography";

export const PortableTextULTick: PortableTextComponents = {
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
        <LI
          $display={"flex"}
          $flexDirection={"row"}
          listStyle={"none"}
          $mb={44}
          $alignItems={"center"}
        >
          <Circle $mr={24} size={36} $background={"white"}>
            <Icon size={28} name={"tick"} />
          </Circle>
          <Span $font={"heading-7"}>{listItemText}</Span>
        </LI>
      );
    },
  },
};
