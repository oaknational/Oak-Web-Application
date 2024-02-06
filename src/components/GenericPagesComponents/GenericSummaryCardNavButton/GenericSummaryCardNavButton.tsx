import { FC } from "react";
import { OakPrimaryNavItem } from "@oaknational/oak-components";

import useIsCurrent from "@/components/SharedComponents/useIsCurrent/useIsCurrent";
import { HTMLAnchorProps } from "@/components/SharedComponents/Button/common";
import { FlexList } from "@/components/SharedComponents/Typography/UL";
import { LI } from "@/components/SharedComponents/Typography";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

type LinkProps = {
  label: string;
  href: string;
  isCurrentOverride?: boolean;
  arrowSuffix?: boolean;
  shallow?: boolean;
};

type GenericSummaryCardNavButtonProps = {
  ariaLabel: string;
  buttons: LinkProps[];
  arrowSuffix?: boolean;
  shallow?: boolean;
} & FlexProps;

export const NavLink = ({ label, href }: LinkProps) => {
  const isCurrent = useIsCurrent({ href });
  const htmlAnchorProps: HTMLAnchorProps = {
    "aria-current": isCurrent ? "page" : undefined,
  };

  return (
    <LI listStyle="none" $mr={[0, 24]} $mb={[0, 24]}>
      {/* Desktop */}
      <Box $display={["none", "block"]} $maxWidth={["100%"]}>
        <OakPrimaryNavItem href={href} isCurrent={isCurrent} children={label} />
      </Box>

      {/* Mobile */}
      <Flex $flexDirection={"row"} $display={["flex", "none"]}>
        <ButtonAsLink
          htmlAnchorProps={htmlAnchorProps}
          isCurrent={isCurrent}
          currentStyles={["arrow-icon", "color"]}
          $iconPosition={"leading"}
          iconBackground="transparent"
          variant={"minimal"}
          label={label}
          page={null}
          href={href}
          $mr={[0, 36]}
        />
      </Flex>
    </LI>
  );
};

/**
 * Renders a 'nav' element containing a list of links styled as buttons.
 * Stacks vertically and styled differently at mobile.
 *
 * ## Usage
 *
 * Used in the 'About Us' summary card and lessons page.
 */
const GenericSummaryCardNavButton: FC<GenericSummaryCardNavButtonProps> = ({
  buttons,
  ariaLabel,
  arrowSuffix,
  shallow,
  ...props
}) => {
  return (
    <nav aria-label={ariaLabel}>
      <FlexList
        $flexWrap={"wrap"}
        $alignItems={["flex-start", "center"]}
        $flexDirection={["column", "row"]}
        $pa={0}
        {...props}
      >
        {buttons.map((button) => (
          <NavLink
            key={button.href}
            shallow={shallow}
            {...button}
            arrowSuffix={arrowSuffix}
          />
        ))}
      </FlexList>
    </nav>
  );
};

export default GenericSummaryCardNavButton;
