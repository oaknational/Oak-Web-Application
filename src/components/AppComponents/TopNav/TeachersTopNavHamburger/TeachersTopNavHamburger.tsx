"use client";
import { useState, useCallback, useMemo } from "react";
import {
  OakSecondaryButton,
  OakInformativeModal,
  OakBox,
} from "@oaknational/oak-components";

import { HamburgerMenuContent } from "./HamburgerSubMenu";

import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

export type SubmenuState =
  | "Keystages" // value = keystage
  | "About us"
  | "Guidance"
  | "KS4Options" // value = subject
  | "MainMenu"
  | null;

type HamburgerState = { menu: SubmenuState; value?: string } | null;

export type HamburgerMenuHook = {
  submenuOpen: HamburgerState | undefined;
  prevSubmenu: HamburgerState | undefined;
  handleOpenHamburger: () => void;
  handleCloseHamburger: () => void;
  handleCloseSubmenu: () => void;
  handleNav: (newMenu: HamburgerState) => void;
};

export const getEYFSAriaLabel = (title: string) => {
  const isEYFS = title === "EYFS";
  return isEYFS ? "Early years foundation stage" : undefined;
};

export const useHamburgerMenuState = (): HamburgerMenuHook => {
  const [menuState, setMenuState] = useState<Array<HamburgerState>>([]);
  const [prevSubmenu, setPrevSubmenu] = useState<HamburgerState | null>(null);

  const submenuOpen = useMemo(() => menuState.at(-1), [menuState]);

  const handleOpenHamburger = useCallback(() => {
    setMenuState([{ menu: "MainMenu" }]);
  }, []);

  const handleCloseSubmenu = () => {
    setPrevSubmenu(menuState?.at(-1) ?? null);
    setMenuState((prevMenu) => {
      const newMenu = prevMenu.slice(0, -1);
      return newMenu;
    });
  };

  const handleNav = (newMenu: HamburgerState) => {
    setPrevSubmenu(menuState?.at(-1) ?? null);
    setMenuState((prevMenu) => [...prevMenu, newMenu]);
  };

  const handleCloseHamburger = () => {
    setMenuState([]);
    setPrevSubmenu(null);
  };

  return {
    submenuOpen,
    prevSubmenu,
    handleOpenHamburger,
    handleCloseHamburger,
    handleNav,
    handleCloseSubmenu,
  };
};

export function TeachersTopNavHamburger(props: Readonly<TeachersSubNavData>) {
  const hamburgerMenu = useHamburgerMenuState();
  const { handleOpenHamburger, submenuOpen, handleCloseHamburger } =
    hamburgerMenu;

  return (
    <OakBox $display={["block", "block", "none"]}>
      <OakSecondaryButton
        iconGap={"spacing-0"}
        data-testid="top-nav-hamburger-button"
        $borderStyle={"none"}
        iconName="hamburger"
        aria-label="Open navigation menu"
        aria-expanded={!!submenuOpen}
        aria-controls={submenuOpen ? "teachers-top-nav-hamburger" : undefined}
        onClick={handleOpenHamburger}
      />
      <OakInformativeModal
        isOpen={!!submenuOpen}
        onClose={handleCloseHamburger}
        closeOnBackgroundClick
        largeScreenMaxWidth={480}
      >
        <OakBox
          $width={"100%"}
          $height={"100%"}
          id="teachers-top-nav-hamburger"
        >
          <HamburgerMenuContent {...props} hamburgerMenu={hamburgerMenu} />
        </OakBox>
      </OakInformativeModal>
    </OakBox>
  );
}
