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
  const navitems = [1, 2, 3];
  return (
    <OakBox $position={"relative"} $width={"100%"} $height={"100%"}>
      <OakUL>
        {navitems.map((i) => (
          <NavItem key={i} />
        ))}
      </OakUL>
    </OakBox>
  );
}

function NavItem() {
  const [submenuIsOpen, setSubmenuIsOpen] = useState(false);

  return (
    <MainContent setSubmenuIsOpen={setSubmenuIsOpen}>
      <SubmenuContent
        submenuIsOpen={submenuIsOpen}
        setSubmenuIsOpen={setSubmenuIsOpen}
      />
    </MainContent>
  );
}

function MainContent({
  setSubmenuIsOpen,
  children,
}: {
  readonly setSubmenuIsOpen: Dispatch<SetStateAction<boolean>>;
  readonly children: ReactElement;
}) {
  return (
    <OakBox $width={"100%"}>
      <OakLI>
        <OakSecondaryLink onClick={() => setSubmenuIsOpen(true)}>
          Hello
        </OakSecondaryLink>
        <OakUL>{children}</OakUL>
      </OakLI>
    </OakBox>
  );
}

function SubmenuContent({
  submenuIsOpen,
  setSubmenuIsOpen,
}: {
  readonly submenuIsOpen: boolean;
  readonly setSubmenuIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const subNavItems = [1, 2, 3];
  return (
    <OakBox
      $display={submenuIsOpen ? "block" : "none"}
      $position={"absolute"}
      $top={"spacing-0"}
      $left={"spacing-0"}
      $width={"100%"}
      $height={"100%"}
      $background={"white"}
      $zIndex={"modal-dialog"}
    >
      <OakSecondaryLink onClick={() => setSubmenuIsOpen(false)}>
        Back
      </OakSecondaryLink>
      {subNavItems.map((i) => (
        <OakLI key={i}> {i}</OakLI>
      ))}
    </OakBox>
  );
}
