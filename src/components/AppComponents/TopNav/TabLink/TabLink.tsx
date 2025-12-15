import { ReactNode } from "react";

import {
  OakSecondaryButton,
  OakPrimaryButton,
  OakPrimaryButtonProps,
} from "@/styles/oakThemeApp";

const TabLink = ({
  isSelected,
  children,
  href,
  ...buttonProps
}: {
  isSelected: boolean;
  children: ReactNode;
  href: string;
} & OakPrimaryButtonProps) => {
  const Component = isSelected ? OakSecondaryButton : OakPrimaryButton;

  return (
    <Component
      element="a"
      $bblr={"border-radius-square"}
      $bbrr={"border-radius-square"}
      $bb={"border-solid-none"}
      width={["100%", "max-content"]}
      hoverShadow={isSelected ? null : "drop-shadow-lemon"}
      href={href}
      font={["body-3-bold", "heading-7", "heading-7"]}
      ph={["spacing-0", "spacing-16"]}
      {...buttonProps}
    >
      {!isSelected && "Go to "}
      {children}
    </Component>
  );
};

export default TabLink;
