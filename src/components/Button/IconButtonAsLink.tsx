import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  FC,
  KeyboardEvent,
} from "react";
import Link, { LinkProps } from "next/link";

import createErrorHandler from "../../common-lib/error-handler";
import OakError from "../../errors/OakError";

import IconButtonInner, { IconButtonInnerProps } from "./IconButtonInner";

const handleError = createErrorHandler("IconButtonAsLink");

type IconButtonProps = IconButtonInnerProps & {
  "aria-label": string;
  href: string;
  nextLinkProps?: Omit<LinkProps, "href">;
  anchorProps?: Omit<
    DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    "ref" | "aria-label"
  >;
};

const IconButton: FC<IconButtonProps> = (props) => {
  const {
    variant,
    size,
    icon,
    iconColorOverride,
    "aria-label": ariaLabel,
    href,
    nextLinkProps,
    anchorProps,
  } = props;

  const onKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.code === "Space" || e.keyCode === 32) {
      e.preventDefault();
      // trigger the target's click event
      if (!(e.target instanceof HTMLElement)) {
        const error = new OakError({ code: "misc/unexpected-type" });
        return handleError(error);
      }
      e.target.click();
    }
  };

  return (
    <Link {...nextLinkProps} href={href} passHref>
      <a
        {...anchorProps}
        aria-label={ariaLabel}
        role="button"
        onKeyDown={onKeyDown}
      >
        <IconButtonInner
          icon={icon}
          size={size}
          variant={variant}
          iconColorOverride={iconColorOverride}
        />
      </a>
    </Link>
  );
};

export default IconButton;
