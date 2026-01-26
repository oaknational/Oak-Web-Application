"use client";
import { Dispatch, SetStateAction, useState, useCallback } from "react";
import {
  OakSecondaryButton,
  OakInformativeModal,
  OakBox,
} from "@oaknational/oak-components";

import { MainMenuContent } from "./HamburgerMainMenu";
import { SubmenuContent } from "./HamburgerSubMenu";

import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

export type SubmenuState =
  | "KS1"
  | "KS2"
  | "EYFS"
  | "KS3"
  | "KS4"
  | "About us"
  | "Guidance"
  | null;

export type HamburgerMenuHook = {
  submenuOpen: SubmenuState;
  setSubmenuOpen: Dispatch<SetStateAction<SubmenuState>>;
  prevSubmenu: SubmenuState;
  handleClose: () => void;
  handleCloseSubmenu: () => void;
};

export const getEYFSAriaLabel = (title: SubmenuState) => {
  const isEYFS = title === "EYFS";
  return isEYFS ? "Early years foundation stage" : undefined;
};

export const useHamburgerMenuState = (): HamburgerMenuHook => {
  const [submenuOpen, setSubmenuOpen] = useState<SubmenuState>(null);
  const [prevSubmenu, setPrevSubmenu] = useState<SubmenuState>(null);

  const handleClose = useCallback(() => {
    setSubmenuOpen(null);
    setPrevSubmenu(null);
  }, []);

  const handleCloseSubmenu = useCallback(() => {
    setPrevSubmenu(submenuOpen);
    setSubmenuOpen(null);
  }, [submenuOpen]);

  return {
    submenuOpen,
    setSubmenuOpen,
    prevSubmenu,
    handleClose,
    handleCloseSubmenu,
  };
};

export function TeachersTopNavHamburger(props: Readonly<TeachersSubNavData>) {
  const [isOpen, setIsOpen] = useState(false);
  const hamburgerMenu = useHamburgerMenuState();

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    hamburgerMenu.setSubmenuOpen(null);
  }, [hamburgerMenu]);

  const handleClose = useCallback(() => {
    hamburgerMenu.handleClose();
    setIsOpen(false);
  }, [hamburgerMenu]);

  return (
    <OakBox $display={["block", "block", "none"]}>
      <OakSecondaryButton
        iconGap={"spacing-0"}
        data-testid="top-nav-hamburger-button"
        $borderStyle={"none"}
        iconName="hamburger"
        onClick={() => handleOpen()}
      />
      <OakInformativeModal
        isOpen={isOpen}
        onClose={() => handleClose()}
        closeOnBackgroundClick
        largeScreenMaxWidth={480}
      >
        <Content {...props} hamburgerMenu={hamburgerMenu} />
      </OakInformativeModal>
    </OakBox>
  );
}

function Content(
  props: Readonly<TeachersSubNavData & { hamburgerMenu: HamburgerMenuHook }>,
) {
  const { hamburgerMenu, ...navData } = props;
  const { submenuOpen } = hamburgerMenu;
  return (
    <OakBox $width={"100%"} $height={"100%"}>
      {submenuOpen ? (
        <SubmenuContent {...navData} hamburgerMenu={hamburgerMenu} />
      ) : (
        <MainMenuContent {...navData} hamburgerMenu={hamburgerMenu} />
      )}
    </OakBox>
  );
}
