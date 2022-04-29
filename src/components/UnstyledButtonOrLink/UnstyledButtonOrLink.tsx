import Link, { LinkProps } from "next/link";
import {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  FC,
  AnchorHTMLAttributes,
} from "react";

import UnstyledButton from "../UnstyledButton";

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
    return (
      <Link {...nextLinkProps} passHref>
        <a {...anchorProps} />
      </Link>
    );
  }

  return <UnstyledButton {...props} />;
};

export default UnstyledButtonOrLink;
