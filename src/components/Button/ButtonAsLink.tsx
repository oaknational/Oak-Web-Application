import { AnchorHTMLAttributes, DetailedHTMLProps, FC } from "react";
import Link, { LinkProps } from "next/link";
import styled from "styled-components";

import { MarginProps } from "../../styles/utils/spacing";

import ButtonInner, { ButtonInnerProps } from "./ButtonInner";
import useButtonAsLinkProps from "./useButtonAsLinkProps";
import { outermostElementStyles } from "./common";

const StyledA = styled.a<MarginProps>`
  ${outermostElementStyles}
`;
type ButtonAsLinkProps = MarginProps &
  ButtonInnerProps & {
    href: string;
    "aria-label"?: string;
    nextLinkProps?: Omit<LinkProps, "href">;
    anchorProps?: Omit<
      DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >,
      "ref"
    >;
  };
const ButtonAsLink: FC<ButtonAsLinkProps> = (props) => {
  const {
    variant,
    href,
    label,
    icon,
    iconPosition,
    "aria-label": ariaLabel,
    size,
    nextLinkProps,
    anchorProps = {},
    ...styleProps
  } = props;

  return (
    <Link {...nextLinkProps} href={href} passHref>
      <StyledA
        {...anchorProps}
        {...useButtonAsLinkProps()}
        title={anchorProps.title || ariaLabel || label}
        aria-label={ariaLabel || label}
        {...styleProps}
      >
        <ButtonInner
          variant={variant}
          label={label}
          icon={icon}
          iconPosition={iconPosition}
          size={size}
        />
      </StyledA>
    </Link>
  );
};

export default ButtonAsLink;
