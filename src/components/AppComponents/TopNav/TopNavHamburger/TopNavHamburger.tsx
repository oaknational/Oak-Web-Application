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

type SubmenuState =
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
  const [submenuOpen, setSubmenuOpen] = useState<SubmenuState>(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
    setSubmenuOpen(false);
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
  readonly title: SubmenuState;
  readonly data: NavItemData;
  readonly renderSubmenu?: (
    submenuOpen: SubmenuState,
    setSubmenuOpen: Dispatch<SetStateAction<SubmenuState>>,
  ) => ReactNode;
}) {
  const { submenuOpen, setSubmenuOpen, handleClose } = useHamburgerMenu();

  const defaultSubmenu = (
    <OakBox
      $display={submenuOpen === title ? "block" : "none"}
      $position={"absolute"}
      $top={"spacing-0"}
      $left={"spacing-0"}
      $zIndex={"modal-dialog"}
    >
      <OakPrimaryInvertedButton
        iconName="chevron-left"
        selected={true}
        onClick={() => {
          setSubmenuOpen(false);
        }}
      >
        Back
      </OakPrimaryInvertedButton>
      {data.type === "links" && (
        <>
          {data.links.map((link) => (
            <OakLI $listStyle={"none"} key={title + link.slug}>
              <OakSecondaryLink href={link.slug}>{link.title}</OakSecondaryLink>
            </OakLI>
          ))}
        </>
      )}
      {data.type === "subjects" && (
        <OakUL>
          {data.subjects.map((s) => (
            <OakLI
              $listStyle={"none"}
              key={s.title + data.keystage + data.phase}
            >
              <OakSubjectIconButton
                phase={data.phase}
                variant="horizontal"
                subjectIconName={("subject-" + s.subjectSlug) as OakIconName}
                onClick={() => {
                  handleClose();
                }}
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
    <MainContent title={title}>
      {renderSubmenu
        ? renderSubmenu(submenuOpen, setSubmenuOpen)
        : defaultSubmenu}
    </MainContent>
  );
}

function SubjectsSection(props: TeachersBrowse) {
  return (
    <>
      <MainMenuContentWrapper>
        <OakHeading tag="h2">{props.phaseTitle}</OakHeading>
      </MainMenuContentWrapper>
      {props.keystages.map((keystage) => (
        <NavSection
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

function MainContent({
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
          <OakPrimaryInvertedButton
            onClick={() => {
              setSubmenuOpen(title);
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
  const { submenuOpen } = useHamburgerMenu();
  return <OakBox $display={submenuOpen ? "none" : "block"}>{children}</OakBox>;
}
