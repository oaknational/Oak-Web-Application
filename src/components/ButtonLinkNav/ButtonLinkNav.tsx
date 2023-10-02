import { FC } from "react";

import Box from "../Box";
import ButtonAsLink from "../Button/ButtonAsLink";
import Flex, { FlexProps } from "../Flex";
import useIsCurrent from "../MenuLinks/useIsCurrent";
import { HTMLAnchorProps } from "../Button/common";

type NavLinkProps = {
  label: string;
  href: string;
  isCurrentOverride?: boolean;
  arrowSuffix?: boolean;
  shallow?: boolean;
};
const NavLink = ({
  label,
  href,
  arrowSuffix,
  shallow,
  isCurrentOverride,
}: NavLinkProps) => {
  let isCurrent = useIsCurrent({ href });
  if (typeof isCurrentOverride === "boolean") {
    isCurrent = isCurrentOverride;
  }
  const htmlAnchorProps: HTMLAnchorProps = {
    "aria-current": isCurrent ? "page" : undefined,
  };

  return (
    <>
      {/* Desktop */}
      <Box $display={["none", "block"]} $maxWidth={["100%"]}>
        <ButtonAsLink
          htmlAnchorProps={htmlAnchorProps}
          variant={isCurrent ? "brushNav" : "minimalNav"}
          $hoverStyles={["underline-link-text"]}
          label={label}
          href={href}
          page={null}
          $mr={[0, 36]}
          disabled={isCurrent}
          isCurrent={isCurrent}
          icon={isCurrent && arrowSuffix ? "arrow-right" : undefined}
          iconBackground={isCurrent && arrowSuffix ? "transparent" : undefined}
          $iconPosition="trailing"
          shallow={shallow}
          scroll={!shallow}
        />
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
    </>
  );
};

type ButtonLinkNavProps = {
  ariaLabel: string;
  buttons: NavLinkProps[];
  arrowSuffix?: boolean;
  shallow?: boolean;
} & FlexProps;
/**
 * Renders a 'nav' element containing a list of links styled as buttons.
 * Stacks vertically and styled differently at mobile.
 *
 * ## Usage
 *
 * Used in the 'About Us' summary card and lessons page.
 */
const ButtonLinkNav: FC<ButtonLinkNavProps> = ({
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

export default ButtonLinkNav;
