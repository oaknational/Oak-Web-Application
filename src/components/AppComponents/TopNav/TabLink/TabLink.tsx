import { ReactNode } from "react";

import { OakSecondaryButton, OakPrimaryButton } from "@/styles/oakThemeApp";

const TabLink = ({
  isSelected,
  children,
  href,
}: {
  isSelected: boolean;
  children: ReactNode;
  href: string;
}) => {
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
    >
      {children}
    </Component>
  );
};

export default TabLink;
