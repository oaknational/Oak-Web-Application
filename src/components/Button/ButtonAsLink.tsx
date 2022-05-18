import { AnchorHTMLAttributes, DetailedHTMLProps, FC } from "react";
import Link, { LinkProps } from "next/link";

import ButtonInner, { ButtonInnerProps } from "./ButtonInner";
import useButtonAsLinkProps from "./useButtonAsLinkProps";

type ButtonAsLinkProps = ButtonInnerProps & {
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
  } = props;

  return (
    <Link {...nextLinkProps} href={href} passHref>
      <a
        {...anchorProps}
        {...useButtonAsLinkProps()}
        title={anchorProps.title || ariaLabel || label}
        aria-label={ariaLabel || label}
      >
        <ButtonInner
          variant={variant}
          label={label}
          icon={icon}
          iconPosition={iconPosition}
          size={size}
        />
      </a>
    </Link>
  );
};

export default ButtonAsLink;
