"use client";
import {
  Dispatch,
  SetStateAction,
  useState,
  createContext,
  useContext,
} from "react";
import {
  OakSecondaryButton,
  OakInformativeModal,
  OakBox,
  OakUL,
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
  handleClose: () => void;
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

export function TopNavHamburger(props: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<SubmenuState>(false);
  const handleOpen = () => {
    setIsOpen(true);
    setSubmenuOpen(false);
  };
  const handleClose = () => {
    setSubmenuOpen(false);
    setIsOpen(false);
  };

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
        <HamburgerMenuContext.Provider
          value={{ submenuOpen, setSubmenuOpen, handleClose }}
        >
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
    <OakBox $width={"100%"} $height={"100%"} $pa={"spacing-32"}>
      <OakUL $ph={"spacing-0"}>
        {submenuOpen ? (
          <SubmenuContent {...props.teachers} />
        ) : (
          <MainMenuContent {...props} />
        )}
      </OakUL>
    </OakBox>
  );
}
