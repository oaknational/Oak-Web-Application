"use client";
import {
  Dispatch,
  SetStateAction,
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
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

type HamburgerMenuContextType = {
  submenuOpen: SubmenuState;
  setSubmenuOpen: Dispatch<SetStateAction<SubmenuState>>;
  prevSubmenu: SubmenuState;
  handleClose: () => void;
  handleCloseSubmenu: () => void;
};

const HamburgerMenuContext = createContext<HamburgerMenuContextType | null>(
  null,
);

export const useHamburgerMenu = () => {
  const context = useContext(HamburgerMenuContext);
  if (!context) {
    throw new Error(
      "useHamburgerMenu must be used within HamburgerMenuProvider",
    );
  }
  return context;
};

export const getEYFSAriaLabel = (title: SubmenuState) => {
  const isEYFS = title === "EYFS";
  return isEYFS ? "Early years foundation stage" : undefined;
};

export function TeachersTopNavHamburger(props: Readonly<TeachersSubNavData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<SubmenuState>(null);
  const [prevSubmenu, setPrevSubmenu] = useState<SubmenuState>(null);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setSubmenuOpen(null);
  }, [setIsOpen, setSubmenuOpen]);

  const handleClose = useCallback(() => {
    setSubmenuOpen(null);
    setPrevSubmenu(null);
    setIsOpen(false);
  }, [setSubmenuOpen, setPrevSubmenu, setIsOpen]);

  const handleCloseSubmenu = useCallback(() => {
    const prevState = submenuOpen;
    setPrevSubmenu(prevState);
    setSubmenuOpen(null);
  }, [submenuOpen, setPrevSubmenu, setSubmenuOpen]);

  const contextValue = useMemo(
    () => ({
      submenuOpen,
      setSubmenuOpen,
      handleClose,
      prevSubmenu,
      handleCloseSubmenu,
    }),
    [submenuOpen, setSubmenuOpen, handleClose, prevSubmenu, handleCloseSubmenu],
  );

  return (
    <OakBox $display={["block", "block", "none"]}>
      <OakSecondaryButton
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
        <HamburgerMenuContext.Provider value={contextValue}>
          <Content {...props} />
        </HamburgerMenuContext.Provider>
      </OakInformativeModal>
    </OakBox>
  );
}

function Content(props: Readonly<TeachersSubNavData>) {
  const { submenuOpen } = useHamburgerMenu();

  return (
    <OakBox $width={"100%"} $height={"100%"}>
      {submenuOpen ? (
        <SubmenuContent {...props} />
      ) : (
        <MainMenuContent {...props} />
      )}
    </OakBox>
  );
}
