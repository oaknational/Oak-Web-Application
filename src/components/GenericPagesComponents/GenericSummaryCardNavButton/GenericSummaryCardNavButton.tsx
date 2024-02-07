import { FC } from "react";
import { OakLI, OakPrimaryNavItem } from "@oaknational/oak-components";

import useIsCurrent from "@/components/SharedComponents/useIsCurrent/useIsCurrent";
import { HTMLAnchorProps } from "@/components/SharedComponents/Button/common";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Box from "@/components/SharedComponents/Box";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex";

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
    <OakLI
      $listStyle="none"
      $mr={["space-between-none", "space-between-m"]}
      $mb={["space-between-none", "space-between-m"]}
    >
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
    </OakLI>
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
      <Flex
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
      </Flex>
    </nav>
  );
};

export default GenericSummaryCardNavButton;
