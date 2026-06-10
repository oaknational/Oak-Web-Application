import { ReactNode, useEffect, useRef, useState } from "react";
import {
  OakPrimaryInvertedButton,
  OakUL,
  OakLeftAlignedButton,
  OakFlex,
  OakHeading,
  OakLI,
} from "@oaknational/oak-components";
import Link from "next/link";

import TopNavSubjectButtons from "../TopNavDropdown/TopNavSubjectButtons";
import ExamBoardPanel from "../ExamBoardPanel/ExamBoardPanel";

import { HamburgerMenuHook } from "./TeachersTopNavHamburger";

import {
  Phase,
  SubjectsNavItem,
  TeachersBrowseChildItem,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import {
  OakLinkPropsRequiringPageOnly,
  resolveOakHref,
} from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";

const isEyfsKeystage = (keystage: TeachersBrowseChildItem) =>
  keystage.slug === "early-years-foundation-stage";

const getKeystageListLabel = (keystage: TeachersBrowseChildItem) =>
  isEyfsKeystage(keystage) ? keystage.title : keystage.description;

const getKeystageListAriaLabel = (keystage: TeachersBrowseChildItem) =>
  isEyfsKeystage(keystage) ? keystage.description : undefined;

export function SubmenuContainer({
  title,
  ariaLabel,
  children,
  hamburgerMenu,
  onBack,
}: {
  readonly title: string;
  readonly ariaLabel?: string;
  readonly children: ReactNode;
  readonly hamburgerMenu: HamburgerMenuHook;
  readonly onBack?: () => void;
}) {
  const { submenuOpen, handleCloseSubmenu } = hamburgerMenu;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submenuOpen || !containerRef.current) return;

    const firstSubjectButton = containerRef.current.querySelector<HTMLElement>(
      '[data-testid^="topnav-subject-button-"]',
    );

    const fallbackFocusable = containerRef.current.querySelector<HTMLElement>(
      "a[href], button:not(:disabled), [tabindex]:not([tabindex='-1'])",
    );

    (firstSubjectButton ?? fallbackFocusable)?.focus();
  }, [submenuOpen]);
  return (
    <OakFlex
      $ph={"spacing-40"}
      $pb={"spacing-40"}
      $pt={"spacing-4"}
      $gap={"spacing-40"}
      $flexDirection={"column"}
      ref={containerRef}
      data-testid="submenu-container"
    >
      <OakPrimaryInvertedButton
        iconName="chevron-left"
        aria-label={ariaLabel}
        selected={true}
        onClick={() => {
          if (onBack) {
            onBack();
            return;
          }
          handleCloseSubmenu();
        }}
      >
        <OakHeading $font="heading-6" tag="h3">
          {title}
        </OakHeading>
      </OakPrimaryInvertedButton>

      {children}
    </OakFlex>
  );
}

function SubjectsSubmenu({
  title,
  backButtonAriaLabel,
  subjects,
  keyStageSlug,
  phase,
  hamburgerMenu,
  selectedExamBoardSubject,
  setSelectedExamBoardSubject,
  onBack,
}: {
  readonly title: string;
  readonly backButtonAriaLabel?: string;
  readonly subjects: SubjectsNavItem[];
  readonly keyStageSlug: string;
  readonly phase: Phase;
  readonly hamburgerMenu: HamburgerMenuHook;
  readonly selectedExamBoardSubject: SubjectsNavItem | null;
  readonly setSelectedExamBoardSubject: (
    subject: SubjectsNavItem | null,
  ) => void;
  readonly onBack?: () => void;
}) {
  const { track } = useAnalytics();
  const { handleCloseHamburger } = hamburgerMenu;

  if (selectedExamBoardSubject?.examBoards?.length) {
    return (
      <SubmenuContainer
        title={`${title}, ${selectedExamBoardSubject.title}`}
        hamburgerMenu={hamburgerMenu}
        onBack={() => setSelectedExamBoardSubject(null)}
      >
        <ExamBoardPanel
          examBoards={selectedExamBoardSubject.examBoards}
          phaseSlug={phase}
          viewType={keyStageSlug}
          selectedSubject={selectedExamBoardSubject}
          onClick={(subjectSlug, keystageSlug) => {
            track.browseRefined({
              platform: "owa",
              product: "teacher lesson resources",
              engagementIntent: "refine",
              componentType: "topnav-browse-button",
              eventVersion: "2.0.0",
              analyticsUseCase: "Teacher",
              filterType: "Subject filter",
              filterValue: subjectSlug,
              activeFilters: { keystages: [keystageSlug] },
              googleLoginHint: null,
              clientEnvironment: null,
            });
            handleCloseHamburger();
          }}
          onLeave={() => setSelectedExamBoardSubject(null)}
        />
      </SubmenuContainer>
    );
  }

  return (
    <SubmenuContainer
      ariaLabel={backButtonAriaLabel}
      title={title}
      hamburgerMenu={hamburgerMenu}
      onBack={onBack}
    >
      <TopNavSubjectButtons
        handleClick={(subjectSlug, keystageSlug) => {
          track.browseRefined({
            platform: "owa",
            product: "teacher lesson resources",
            engagementIntent: "refine",
            componentType: "topnav-browse-button",
            eventVersion: "2.0.0",
            analyticsUseCase: "Teacher",
            filterType: "Subject filter",
            filterValue: subjectSlug,
            activeFilters: { keystages: [keystageSlug] },
            googleLoginHint: null,
            clientEnvironment: null,
          });
          handleCloseHamburger();
        }}
        selectedMenu={phase}
        subjects={subjects}
        selectedSubject={selectedExamBoardSubject}
        viewTypeSlug={keyStageSlug}
        phase={phase}
        onExamBoardPanelOpen={setSelectedExamBoardSubject}
        closeExamBoardPanel={() => setSelectedExamBoardSubject(null)}
      />
    </SubmenuContainer>
  );
}

export function SubmenuContent(
  props: Readonly<TeachersSubNavData & { hamburgerMenu: HamburgerMenuHook }>,
) {
  const { hamburgerMenu, ...navData } = props;
  const { track } = useAnalytics();
  const { submenuOpen, handleCloseHamburger } = hamburgerMenu;
  const [selectedExamBoardSubject, setSelectedExamBoardSubject] =
    useState<SubjectsNavItem | null>(null);
  const [selectedKeystage, setSelectedKeystage] =
    useState<TeachersBrowseChildItem | null>(null);

  useEffect(() => {
    setSelectedExamBoardSubject(null);
    setSelectedKeystage(null);
  }, [submenuOpen]);

  if (!submenuOpen) return null;

  switch (submenuOpen) {
    case "About us":
    case "Guidance": {
      const links =
        submenuOpen === "About us" ? navData.aboutUs : navData.guidance;
      return (
        <SubmenuContainer title={submenuOpen} hamburgerMenu={hamburgerMenu}>
          <OakUL
            $display={"flex"}
            $flexDirection={"column"}
            $pl="spacing-40"
            $gap={"spacing-16"}
          >
            {links.children.map((link) => (
              <OakLI key={link.slug} $listStyle={"none"}>
                <OakLeftAlignedButton
                  onClick={() => {
                    handleCloseHamburger();
                  }}
                  element={Link}
                  target={link.external ? "_blank" : "_self"}
                  iconName={link.external ? "external" : undefined}
                  aria-label={
                    link.external
                      ? `${link.title} (this will open in a new tab)`
                      : undefined
                  }
                  isTrailingIcon
                  href={resolveOakHref({
                    page: link.slug,
                  } as OakLinkPropsRequiringPageOnly)}
                >
                  {link.title}
                </OakLeftAlignedButton>
              </OakLI>
            ))}
          </OakUL>
        </SubmenuContainer>
      );
    }

    case "Primary subjects":
    case "Secondary subjects": {
      const phase: Phase =
        submenuOpen === "Primary subjects" ? "primary" : "secondary";
      const phaseData = navData[phase];
      const phaseItem = phaseData.children.find(
        (child) => child.type === "phase",
      );
      if (!phaseItem) return null;

      return (
        <SubjectsSubmenu
          title={submenuOpen}
          subjects={phaseItem.children}
          keyStageSlug={phase}
          phase={phase}
          hamburgerMenu={hamburgerMenu}
          selectedExamBoardSubject={selectedExamBoardSubject}
          setSelectedExamBoardSubject={setSelectedExamBoardSubject}
        />
      );
    }

    case "Primary key stages":
    case "Secondary key stages": {
      const phase: Phase =
        submenuOpen === "Primary key stages" ? "primary" : "secondary";
      const phaseData = navData[phase];
      const keystages = phaseData.children.filter(
        (child) => child.type === "keystage",
      );

      if (selectedKeystage) {
        return (
          <SubjectsSubmenu
            title={getKeystageListLabel(selectedKeystage)}
            backButtonAriaLabel={getKeystageListAriaLabel(selectedKeystage)}
            subjects={selectedKeystage.children}
            keyStageSlug={selectedKeystage.slug}
            phase={phase}
            hamburgerMenu={hamburgerMenu}
            selectedExamBoardSubject={selectedExamBoardSubject}
            setSelectedExamBoardSubject={setSelectedExamBoardSubject}
            onBack={() => setSelectedKeystage(null)}
          />
        );
      }

      return (
        <SubmenuContainer title={submenuOpen} hamburgerMenu={hamburgerMenu}>
          <OakUL
            $display={"flex"}
            $flexDirection={"column"}
            $gap={"spacing-16"}
          >
            {keystages.map((keystage) => (
              <OakLI key={keystage.slug} $listStyle={"none"} $width={"100%"}>
                <OakLeftAlignedButton
                  aria-haspopup={true}
                  aria-label={getKeystageListAriaLabel(keystage)}
                  rightAlignIcon
                  iconName="chevron-right"
                  width={"100%"}
                  onClick={() => {
                    track.browseRefined({
                      platform: "owa",
                      product: "teacher lesson resources",
                      engagementIntent: "refine",
                      componentType: "topnav-browse-button",
                      eventVersion: "2.0.0",
                      analyticsUseCase: "Teacher",
                      filterType: "Key stage filter",
                      filterValue: keystage.slug,
                      activeFilters: {},
                      googleLoginHint: null,
                      clientEnvironment: null,
                    });
                    setSelectedKeystage(keystage);
                  }}
                >
                  {getKeystageListLabel(keystage)}
                </OakLeftAlignedButton>
              </OakLI>
            ))}
          </OakUL>
        </SubmenuContainer>
      );
    }

    default:
      return null;
  }
}
