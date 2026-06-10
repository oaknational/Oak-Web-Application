import { ReactNode, useEffect, useRef, useState } from "react";
import {
  OakBox,
  OakPrimaryInvertedButton,
  OakUL,
  OakLeftAlignedButton,
  OakFlex,
  OakHeading,
} from "@oaknational/oak-components";
import Link from "next/link";

import TopNavSubjectButtons from "../TopNavDropdown/TopNavSubjectButtons";
import ExamBoardPanel from "../ExamBoardPanel/ExamBoardPanel";

import {
  getEYFSAriaLabel,
  HamburgerMenuHook,
  SubmenuState,
} from "./TeachersTopNavHamburger";

import {
  SubjectsNavItem,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import {
  OakLinkPropsRequiringPageOnly,
  resolveOakHref,
} from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";

export function SubmenuContainer({
  title,
  description,
  children,
  hamburgerMenu,
  onBack,
}: {
  readonly title: SubmenuState;
  readonly description?: string;
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
        aria-label={getEYFSAriaLabel(title)}
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
          {description || title}
        </OakHeading>
      </OakPrimaryInvertedButton>

      {children}
    </OakFlex>
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

  useEffect(() => {
    setSelectedExamBoardSubject(null);
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
              <OakBox key={link.slug}>
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
              </OakBox>
            ))}
          </OakUL>
        </SubmenuContainer>
      );
    }

    default: {
      const phase = ["KS1", "KS2", "EYFS"].includes(submenuOpen)
        ? "primary"
        : "secondary";
      const phaseData = navData[phase];
      const keystage = phaseData.children.find(
        (ks) => ks.title === submenuOpen,
      );
      if (!keystage) return null;
      const subjects = keystage.children;

      if (selectedExamBoardSubject?.examBoards?.length) {
        return (
          <SubmenuContainer
            title={
              `${keystage.title}, ${selectedExamBoardSubject.title}` as SubmenuState
            }
            hamburgerMenu={hamburgerMenu}
            onBack={() => setSelectedExamBoardSubject(null)}
          >
            <ExamBoardPanel
              examBoards={selectedExamBoardSubject.examBoards}
              phaseSlug={phase}
              viewType={keystage.slug}
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
          description={keystage.description}
          title={submenuOpen}
          hamburgerMenu={hamburgerMenu}
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
            viewTypeSlug={keystage.slug}
            phase={phase}
            onExamBoardPanelOpen={setSelectedExamBoardSubject}
            closeExamBoardPanel={() => setSelectedExamBoardSubject(null)}
          />
        </SubmenuContainer>
      );
    }
  }
}
