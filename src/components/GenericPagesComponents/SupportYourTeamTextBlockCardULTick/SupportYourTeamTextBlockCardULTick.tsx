import { PortableTextComponents } from "@portabletext/react";
import { OakLI, OakUL, OakSpan } from "@oaknational/oak-components";

import Circle from "@/components/SharedComponents/Circle";
import Icon from "@/components/SharedComponents/Icon";

export const SupportYourTeamTextBlockCardULTick: PortableTextComponents = {
  list: {
    bullet: ({ children }) => (
      <OakUL
        $mt={"space-between-m2"}
        $ml={"space-between-none"}
        $pa={"inner-padding-none"}
      >
        {children}
      </OakUL>
    ),
  },

  listItem: {
    bullet: (props) => {
      const listItemText = props?.value?.children[0]?.text;

      return (
        <OakLI
          $display={"flex"}
          $flexDirection={"row"}
          $listStyle={"none"}
          $mb="space-between-l"
          $alignItems={"center"}
        >
          <Circle $mr={24} size={36} $background={"white"}>
            <Icon size={28} name={"tick"} />
          </Circle>
          <OakSpan $font={"heading-7"}>{listItemText}</OakSpan>
        </OakLI>
      );
    },
  },
};
