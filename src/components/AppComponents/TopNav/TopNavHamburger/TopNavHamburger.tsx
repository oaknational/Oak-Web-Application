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
  OakHeading,
} from "@oaknational/oak-components";

import { TopNavProps } from "../TopNav";

import {
  MainMenuContent,
  MainMenuContentWrapper,
  MainMenuLink,
} from "./HamburgerMainMenu";
import {
  NavItemData,
  SubmenuContainer,
  SubmenuContent,
} from "./HamburgerSubMenu";

import { TeachersBrowse } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

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
  if (!props.teachers) return;

  return (
    <OakBox
      $position={"relative"}
      $width={"100%"}
      $height={"100%"}
      $pa={"spacing-40"}
    >
      <OakUL>
        <SubjectsSection {...props.teachers?.primary} />
        <SubjectsSection {...props.teachers?.secondary} />
        <MainMenuLink title="Curriculum" href="/" />
        <NavItemWithSubmenu
          title="Guidance"
          data={{ type: "links", links: props.teachers.guidance }}
        />
        <NavItemWithSubmenu
          title="About us"
          data={{ type: "links", links: props.teachers.aboutUs }}
        />
        <MainMenuLink title="Ai Experiments" href="/" iconName="external" />
      </OakUL>
    </OakBox>
  );
}

function NavItemWithSubmenu({
  title,
  data,
}: {
  readonly title: SubmenuState;
  readonly data: NavItemData;
}) {
  return (
    <MainMenuContent title={title}>
      <SubmenuContainer title={title}>
        <SubmenuContent title={title} data={data} />
      </SubmenuContainer>
    </MainMenuContent>
  );
}

function SubjectsSection(props: TeachersBrowse) {
  return (
    <>
      <MainMenuContentWrapper>
        <OakHeading tag="h2">{props.phaseTitle}</OakHeading>
      </MainMenuContentWrapper>
      {props.keystages.map((keystage) => (
        <NavItemWithSubmenu
          key={keystage.slug}
          title={keystage.title as SubmenuState}
          data={{
            type: "subjects",
            subjects: keystage.subjects,
            keystage: keystage.title,
            phase: props.phaseSlug as "primary" | "secondary",
          }}
        />
      ))}
    </>
  );
}
