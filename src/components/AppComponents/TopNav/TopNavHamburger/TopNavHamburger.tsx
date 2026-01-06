"use client";
import {
  Dispatch,
  SetStateAction,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  OakSecondaryButton,
  OakInformativeModal,
  OakBox,
  OakUL,
  OakLI,
  OakPrimaryInvertedButton,
  OakSubjectIconButton,
  OakIconName,
  OakHeading,
  OakSecondaryLink,
} from "@oaknational/oak-components";

import { TopNavProps } from "../TopNav";
import {
  SubNavLinks,
  TeachersBrowse,
} from "../../../../node-lib/curriculum-api-2023/queries/topNav/topNav.schema";


type HamburgerMenuContextType = {
  hideMainMenu: boolean;
  setHideMainMenu: Dispatch<SetStateAction<boolean>>;
};

const HamburgerMenuContext = createContext<HamburgerMenuContextType | null>(
  null,
);

const useHamburgerMenu = () => {
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
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
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
        <Content {...props} />
      </OakInformativeModal>
    </OakBox>
  );
}

function Content(props: TopNavProps) {
  const [hideMainMenu, setHideMainMenu] = useState(false);
  if (!props.teachers) return;

  return (
    <HamburgerMenuContext.Provider value={{ hideMainMenu, setHideMainMenu }}>
      <OakBox $position={"relative"} $width={"100%"} $height={"100%"}>
        <OakUL>
          <SubjectsSection {...props.teachers?.primary} />
          <SubjectsSection {...props.teachers?.secondary} />
          <MainMenuContentWrapper>
            <OakSecondaryLink href={"/"}>Curriculum</OakSecondaryLink>
          </MainMenuContentWrapper>
          <NavSection
            title="Guidance"
            data={{ type: "links", links: props.teachers.guidance }}
          />
          <NavSection
            title="About us"
            data={{ type: "links", links: props.teachers.aboutUs }}
          />
        </OakUL>
      </OakBox>
    </HamburgerMenuContext.Provider>
  );
}

type NavItemData =
  | { type: "links"; links: SubNavLinks }
  | {
      type: "subjects";
      subjects: TeachersBrowse["keystages"][number]["subjects"];
      keystage: string;
      phase: "primary" | "secondary";
    };

function NavSection({
  title,
  data,
  renderSubmenu,
}: {
  readonly title: string;
  readonly data: NavItemData;
  readonly renderSubmenu?: (
    submenuIsOpen: boolean,
    setSubmenuIsOpen: Dispatch<SetStateAction<boolean>>,
  ) => ReactNode;
}) {
  const [submenuIsOpen, setSubmenuIsOpen] = useState(false);
  const { setHideMainMenu } = useHamburgerMenu();

  const defaultSubmenu = (
    <OakBox
      $display={submenuIsOpen ? "block" : "none"}
      $position={"absolute"}
      $top={"spacing-0"}
      $left={"spacing-0"}
      $zIndex={"modal-dialog"}
    >
      <OakPrimaryInvertedButton
        iconName="chevron-left"
        selected={true}
        onClick={() => {
          setHideMainMenu(false);
          setSubmenuIsOpen(false);
        }}
      >
        Back
      </OakPrimaryInvertedButton>
      {data.type === "links" && (
        <>
          {data.links.map((link) => (
            <OakLI key={title + link.slug}>
              <OakSecondaryLink href={link.slug}>{link.title}</OakSecondaryLink>
            </OakLI>
          ))}
        </>
      )}
      {data.type === "subjects" && (
        <OakUL>
          {data.subjects.map((s) => (
            <OakLI key={s.subjectSlug + data.keystage}>
              <OakSubjectIconButton
                phase={data.phase}
                variant="horizontal"
                subjectIconName={("subject-" + s.subjectSlug) as OakIconName}
                onClick={() => setSubmenuIsOpen(false)}
              >
                {s.title}
              </OakSubjectIconButton>
            </OakLI>
          ))}
        </OakUL>
      )}
    </OakBox>
  );

  return (
    <MainContent setSubmenuIsOpen={setSubmenuIsOpen} title={title}>
      {renderSubmenu
        ? renderSubmenu(submenuIsOpen, setSubmenuIsOpen)
        : defaultSubmenu}
    </MainContent>
  );
}

function SubjectsSection(props: TeachersBrowse) {
  const { hideMainMenu } = useHamburgerMenu();

  return (
    <>
      <OakBox $display={hideMainMenu ? "none" : "block"}>
        <OakHeading tag="h2">{props.phaseTitle}</OakHeading>
      </OakBox>
      {props.keystages.map((keystage) => (
        <NavSection
          key={keystage.slug}
          title={keystage.title}
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

function MainContent({
  title,
  children,
  setSubmenuIsOpen,
}: {
  readonly title: string;
  readonly children: ReactNode;
  readonly setSubmenuIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { setHideMainMenu } = useHamburgerMenu();

  return (
    <OakBox $width={"100%"}>
      <OakLI>
        <MainMenuContentWrapper>
          <OakPrimaryInvertedButton
            onClick={() => {
              setHideMainMenu(true);
              setSubmenuIsOpen(true);
            }}
          >
            {title}
          </OakPrimaryInvertedButton>
        </MainMenuContentWrapper>
        {children}
      </OakLI>
    </OakBox>
  );
}

/**
 * Hides content when the submenu is open
 */
function MainMenuContentWrapper({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { hideMainMenu } = useHamburgerMenu();
  return <OakBox $display={hideMainMenu ? "none" : "block"}>{children}</OakBox>;
}
