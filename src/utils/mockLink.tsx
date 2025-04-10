import React, { isValidElement, ReactElement } from "react";

jest.mock("next/link", () => {
  const mockLink = ({
    children,
    href,
    onClick,
    legacyBehavior,
    ...props
  }: {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    legacyBehavior?: boolean;
  }) => {
    if (legacyBehavior) {
      const child = React.Children.toArray(children)[0]!;
      if (isValidElement(child)) {
        const childOnClick = child?.props?.onClick;
        const node = React.cloneElement(child as ReactElement, {
          onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            e.preventDefault();
            childOnClick?.(e);
          },
        });
        return node;
      }
    } else {
      return (
        <a
          {...props}
          href={href}
          onClick={(e) => {
            e.preventDefault();
            onClick?.();
          }}
        >
          {children}
        </a>
      );
    }
  };
  mockLink.displayName = "Link";
  return mockLink;
});
