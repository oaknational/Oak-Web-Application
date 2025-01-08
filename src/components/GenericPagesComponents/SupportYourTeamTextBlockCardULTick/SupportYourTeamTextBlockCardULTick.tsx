import { PortableTextComponents } from "@portabletext/react";
import { OakLI, OakUL, OakSpan, OakIcon } from "@oaknational/oak-components";

import Circle from "@/components/SharedComponents/Circle";

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
            <OakIcon
              iconName={"tick"}
              $width={"all-spacing-7"}
              $height={"all-spacing-7"}
            />
          </Circle>
          <OakSpan $font={"heading-7"}>{listItemText}</OakSpan>
        </OakLI>
      );
    },
  },
};
