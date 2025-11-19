import { PortableTextComponents } from "@portabletext/react";
import { OakLI, OakUL, OakSpan, OakIcon } from "@oaknational/oak-components";

import Circle from "@/components/SharedComponents/Circle";

export const SupportYourTeamTextBlockCardULTick: PortableTextComponents = {
  list: {
    bullet: ({ children }) => (
      <OakUL $mt={"spacing-32"} $ml={"spacing-0"} $pa={"spacing-0"}>
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
          $mb="spacing-48"
          $alignItems={"center"}
        >
          <Circle $mr={24} size={36} $background={"white"}>
            <OakIcon
              iconName={"tick"}
              $width={"spacing-32"}
              $height={"spacing-32"}
            />
          </Circle>
          <OakSpan $font={"heading-7"}>{listItemText}</OakSpan>
        </OakLI>
      );
    },
  },
};
