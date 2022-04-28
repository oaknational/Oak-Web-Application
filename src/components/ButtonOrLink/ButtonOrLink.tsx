import Link, { LinkProps } from "next/link";
import { DetailedHTMLProps, ButtonHTMLAttributes, FC } from "react";

export type ButtonOrLinkProps = { className?: string } & (
  | LinkProps
  | DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
);
export const ButtonOrLink: FC<ButtonOrLinkProps> = ({
  children,
  className,
  ...props
}) => {
  if ("href" in props) {
    return (
      <Link {...props} passHref>
        <a className={className}>{children}</a>
      </Link>
    );
  }

  return <button className={className} {...props} />;
};
