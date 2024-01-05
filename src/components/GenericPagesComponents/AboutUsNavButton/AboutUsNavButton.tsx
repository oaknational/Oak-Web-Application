import { FC } from "react";

import useIsCurrent from "@/components/MenuLinks/useIsCurrent";
import { HTMLAnchorProps } from "@/components/SharedComponents/Button/common";
import { FlexList } from "@/components/Typography/UL";
import { LI } from "@/components/Typography";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";

type LinkProps = {
  label: string;
  href: string;
  isCurrentOverride?: boolean;
  arrowSuffix?: boolean;
  shallow?: boolean;
};

type AboutUsNavButtonProps = {
  ariaLabel: string;
  buttons: LinkProps[];
  arrowSuffix?: boolean;
  shallow?: boolean;
} & FlexProps;

export const NavLink = ({ label, href, arrowSuffix, shallow }: LinkProps) => {
  const isCurrent = useIsCurrent({ href });
  const htmlAnchorProps: HTMLAnchorProps = {
    "aria-current": isCurrent ? "page" : undefined,
  };

  return (
    <LI listStyle="none">
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
const AboutUsNavButton: FC<AboutUsNavButtonProps> = ({
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

export default AboutUsNavButton;
