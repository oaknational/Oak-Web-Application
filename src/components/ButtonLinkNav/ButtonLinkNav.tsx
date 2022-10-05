import { FC } from "react";

import Box from "../Box";
import ButtonAsLink from "../Button/ButtonAsLink";
import { HTMLAnchorProps } from "../Button/common";
import Flex, { FlexProps } from "../Flex";
import Icon from "../Icon";
import useIsCurrent from "../MenuLinks/useIsCurrent";

type LinkProps = { label: string; href: string };

type ButtonLinkNavProps = {
  ariaLabel: string;
  buttons: LinkProps[];
} & FlexProps;

const NavLink = ({ label, href }: LinkProps) => {
  const isCurrent = useIsCurrent({ href });

  const htmlAnchorProps: HTMLAnchorProps = {
    "aria-current": isCurrent ? "page" : undefined,
  };

  return (
    <>
      {/* Desktop */}
      <Box $display={["none", "block"]}>
        <ButtonAsLink
          htmlAnchorProps={htmlAnchorProps}
          variant={isCurrent ? "minimal" : "brush"}
          label={label}
          href={href}
          $mr={[0, 36]}
          disabled={isCurrent}
        />
      </Box>
      {/* Mobile */}
      <Flex $flexDirection={"row"} $display={["flex", "none"]}>
        {isCurrent && (
          <Flex $alignItems={"center"}>
            <Icon
              $opacity={isCurrent ? 0.6 : 1}
              $ml={12}
              variant={"minimal"}
              name={"ArrowRight"}
            />
          </Flex>
        )}
        <ButtonAsLink
          htmlAnchorProps={htmlAnchorProps}
          $opacity={isCurrent ? 0.6 : 1}
          variant={"minimal"}
          label={label}
          href={href}
          $mr={[0, 36]}
        />
      </Flex>
    </>
  );
};

/**
 * Renders a 'nav' element containing a list of links styled as buttons.
 * Stacks vertically and styled differently at mobile.
 *
 * ## Usage
 *
 * Used in the 'About Us' summary card
 */
const ButtonLinkNav: FC<ButtonLinkNavProps> = ({
  buttons,
  ariaLabel,
  ...props
}) => {
  return (
    <nav aria-label={ariaLabel}>
      <Flex
        $flexWrap={"wrap"}
        $alignItems={["flex-start"]}
        $flexDirection={["column", "row"]}
        {...props}
      >
        {buttons.map((button) => (
          <NavLink key={button.href} {...button} />
        ))}
      </Flex>
    </nav>
  );
};

export default ButtonLinkNav;
