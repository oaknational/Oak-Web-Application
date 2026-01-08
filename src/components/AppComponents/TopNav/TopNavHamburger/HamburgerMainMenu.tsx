import {
  OakBox,
  OakLI,
  OakPrimaryInvertedButton,
  OakIconName,
  OakIcon,
  OakFlex,
} from "@oaknational/oak-components";
import { ReactNode } from "react";

import { SubmenuState, useHamburgerMenu } from "./TopNavHamburger";

export function MainMenuContent({
  title,
  children,
}: {
  readonly title: SubmenuState;
  readonly children: ReactNode;
}) {
  const { setSubmenuOpen } = useHamburgerMenu();

  return (
    <OakBox $width={"100%"}>
      <OakLI $listStyle={"none"}>
        <MainMenuContentWrapper>
          <OakFlex $justifyContent={"space-between"} $width={"100%"}>
            <OakPrimaryInvertedButton
              onClick={() => {
                setSubmenuOpen(title);
              }}
            >
              {title}
            </OakPrimaryInvertedButton>
            <OakIcon iconName="chevron-right" />
          </OakFlex>
        </MainMenuContentWrapper>
        {children}
      </OakLI>
    </OakBox>
  );
}

export function MainMenuLink({
  href,
  title,
  iconName,
}: {
  readonly href: string;
  readonly title: string;
  readonly iconName?: OakIconName;
}) {
  return (
    <MainMenuContentWrapper>
      <OakPrimaryInvertedButton
        element="a"
        isTrailingIcon
        iconName={iconName}
        href={href}
      >
        {title}
      </OakPrimaryInvertedButton>
    </MainMenuContentWrapper>
  );
}

/**
 * Hides content when the submenu is open
 */
export function MainMenuContentWrapper({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { submenuOpen } = useHamburgerMenu();
  return (
    <OakBox $width={"100%"} $display={submenuOpen ? "none" : "block"}>
      {children}
    </OakBox>
  );
}
