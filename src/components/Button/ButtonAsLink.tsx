import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  FC,
  KeyboardEvent,
} from "react";
import Link, { LinkProps } from "next/link";

import OakError from "../../errors/OakError";
import createErrorHandler from "../../common-lib/error-handler";

import ButtonInner, { ButtonInnerProps } from "./ButtonInner";

const handleError = createErrorHandler("ButtonAsLink");

type ButtonAsLinkProps = ButtonInnerProps & {
  href: string;
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
  const { href, label, icon, iconPosition, size, nextLinkProps, anchorProps } =
    props;

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
      <a {...anchorProps} role="button" onKeyDown={onKeyDown}>
        <ButtonInner
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
