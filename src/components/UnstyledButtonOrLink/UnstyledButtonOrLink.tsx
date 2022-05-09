import Link, { LinkProps } from "next/link";
import {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  FC,
  AnchorHTMLAttributes,
  KeyboardEvent,
} from "react";

import createErrorHandler from "../../common-lib/error-handler";
import OakError from "../../errors/OakError";
import UnstyledButton from "../UnstyledButton";

const errorHandler = createErrorHandler("UnstyledButtonOrLink");

export type UnstyledButtonOrLinkProps = { className?: string } & (
  | (LinkProps &
      DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >)
  | DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
);
const UnstyledButtonOrLink: FC<UnstyledButtonOrLinkProps> = (props) => {
  if ("href" in props) {
    const {
      href,
      as,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
      locale,
      ...anchorProps
    } = props;
    const nextLinkProps: LinkProps = {
      href,
      as,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
      locale,
    };
    const onKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
      if (e.code === "Space" || e.keyCode === 32) {
        e.preventDefault();
        // trigger the target's click event
        if (!(e.target instanceof HTMLElement)) {
          const error = new OakError({ code: "misc/unexpected-type" });
          return errorHandler(error);
        }
        e.target.click();
      }
    };
    return (
      <Link {...nextLinkProps} passHref>
        <a {...anchorProps} role="button" onKeyDown={onKeyDown} />
      </Link>
    );
  }

  return <UnstyledButton {...props} />;
};

export default UnstyledButtonOrLink;
