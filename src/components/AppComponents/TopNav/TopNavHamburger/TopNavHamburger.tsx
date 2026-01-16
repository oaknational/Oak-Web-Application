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

import { TopNavProps } from "../TopNav";

import { MainMenuContent } from "./HamburgerMainMenu";
import { SubmenuContent } from "./HamburgerSubMenu";

export type SubmenuState =
  | "KS1"
  | "KS2"
  | "EYFS"
  | "KS3"
  | "KS4"
  | "About us"
  | "Guidance"
  | false;

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

export function TopNavHamburger(props: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<SubmenuState>(false);
  const [prevSubmenu, setPrevSubmenu] = useState<SubmenuState>(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setSubmenuOpen(false);
  }, [setIsOpen, setSubmenuOpen]);

  const handleClose = useCallback(() => {
    setSubmenuOpen(false);
    setPrevSubmenu(false);
    setIsOpen(false);
  }, [setSubmenuOpen, setPrevSubmenu, setIsOpen]);

  const handleCloseSubmenu = useCallback(() => {
    const prevState = submenuOpen;
    setPrevSubmenu(prevState);
    setSubmenuOpen(false);
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

function Content(props: TopNavProps) {
  const { submenuOpen } = useHamburgerMenu();
  if (!props.teachers) return;
  return (
    <OakBox $width={"100%"} $height={"100%"}>
      {submenuOpen ? (
        <SubmenuContent {...props.teachers} />
      ) : (
        <MainMenuContent {...props} />
      )}
    </OakBox>
  );
}
