"use client";
import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import {
  OakSecondaryButton,
  OakInformativeModal,
  OakSecondaryLink,
  OakBox,
  OakUL,
  OakLI,
} from "@oaknational/oak-components";

export function TopNavHamburger() {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
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
        <Content />
      </OakInformativeModal>
    </>
  );
}

function Content() {
  const [hideMainMenu, setHideMainMenu] = useState(false);
  const navitems = [1, 2, 3];
  return (
    <OakBox $position={"relative"} $width={"100%"} $height={"100%"}>
      <OakUL>
        {navitems.map((i) => (
          <NavItem
            hideMainMenu={hideMainMenu}
            setHideMainMenu={setHideMainMenu}
            key={i}
          />
        ))}
      </OakUL>
    </OakBox>
  );
}

function NavItem({
  hideMainMenu,
  setHideMainMenu,
}: {
  readonly hideMainMenu: boolean;
  readonly setHideMainMenu: Dispatch<SetStateAction<boolean>>;
}) {
  const [submenuIsOpen, setSubmenuIsOpen] = useState(false);

  return (
    <MainContent
      hideMainMenu={hideMainMenu}
      setHideMainMenu={setHideMainMenu}
      setSubmenuIsOpen={setSubmenuIsOpen}
    >
      <SubmenuContent
        setHideMainMenu={setHideMainMenu}
        submenuIsOpen={submenuIsOpen}
        setSubmenuIsOpen={setSubmenuIsOpen}
      />
    </MainContent>
  );
}

function MainContent({
  hideMainMenu,
  setHideMainMenu,
  setSubmenuIsOpen,
  children,
}: {
  readonly hideMainMenu: boolean;
  readonly setHideMainMenu: Dispatch<SetStateAction<boolean>>;
  readonly setSubmenuIsOpen: Dispatch<SetStateAction<boolean>>;
  readonly children: ReactElement;
}) {
  return (
    <OakBox $width={"100%"}>
      <OakLI>
        <OakBox $display={hideMainMenu ? "none" : "block"}>
          <OakSecondaryButton
            onClick={() => {
              setHideMainMenu(true);
              setSubmenuIsOpen(true);
            }}
          >
            Hello
          </OakSecondaryButton>
        </OakBox>
        <OakUL>{children}</OakUL>
      </OakLI>
    </OakBox>
  );
}

function SubmenuContent({
  submenuIsOpen,
  setSubmenuIsOpen,
  setHideMainMenu,
}: {
  readonly submenuIsOpen: boolean;
  readonly setSubmenuIsOpen: Dispatch<SetStateAction<boolean>>;
  readonly setHideMainMenu: Dispatch<SetStateAction<boolean>>;
}) {
  const subNavItems = [1, 2, 3];
  return (
    <OakBox
      $display={submenuIsOpen ? "block" : "none"}
      $position={"absolute"}
      $top={"spacing-0"}
      $left={"spacing-0"}
      $zIndex={"modal-dialog"}
    >
      <OakSecondaryButton
        onClick={() => {
          setHideMainMenu(false);
          setSubmenuIsOpen(false);
        }}
      >
        Back
      </OakSecondaryButton>
      {subNavItems.map((i) => (
        <OakLI key={i}>
          <OakSecondaryLink href="/" onClick={() => setSubmenuIsOpen(false)}>
            {" "}
            {i}{" "}
          </OakSecondaryLink>
        </OakLI>
      ))}
    </OakBox>
  );
}
