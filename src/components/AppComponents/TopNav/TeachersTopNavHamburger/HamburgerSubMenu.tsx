import { ReactNode, useEffect, useRef } from "react";
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
import { TopNavKS4Buttons } from "../TopNavDropdown/TopNavKS4Buttons";

import { HamburgerMenuHook } from "./TeachersTopNavHamburger";
import { MainMenuButton, MainMenuContent } from "./HamburgerMainMenu";

import {
  getKeystageSubjectsData,
  getKs4OptionSubjectData,
  getPhaseSlug,
  KeystageSubjectsMenu,
  SubjectsMenu,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import {
  OakLinkPropsRequiringPageOnly,
  resolveOakHref,
} from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";

const isEyfsKeystage = (keystage: KeystageSubjectsMenu) =>
  keystage.slug === "early-years-foundation-stage";

const getKeystageListLabel = (keystage: KeystageSubjectsMenu) =>
  isEyfsKeystage(keystage) ? keystage.title : keystage.description;

const getKeystageListAriaLabel = (keystage: KeystageSubjectsMenu) =>
  isEyfsKeystage(keystage) ? keystage.description : undefined;

function SubmenuContainer({
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

    const firstMenuButton = containerRef.current.querySelector<HTMLElement>(
      "button:not(#hamburger-back-button), a[href]",
    );

    const fallbackFocusable = containerRef.current.querySelector<HTMLElement>(
      "a[href], button:not(:disabled), [tabindex]:not([tabindex='-1'])",
    );

    (firstMenuButton ?? fallbackFocusable)?.focus();
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
        $pl="spacing-0"
        onClick={() => {
          if (onBack) {
            onBack();
            return;
          }
          handleCloseSubmenu();
        }}
        id="hamburger-back-button"
      >
        <OakHeading $font="heading-6" tag="h3">
          {title}
        </OakHeading>
      </OakPrimaryInvertedButton>

      {children}
    </OakFlex>
  );
}

export function HamburgerMenuContent(
  props: Readonly<TeachersSubNavData & { hamburgerMenu: HamburgerMenuHook }>,
) {
  const { hamburgerMenu, ...navData } = props;
  const { track } = useAnalytics();
  const { submenuOpen, handleNav, handleCloseHamburger } = hamburgerMenu;

  if (!submenuOpen) return null;

  switch (submenuOpen.menu) {
    case "OakMenu": {
      const links =
        submenuOpen.value === "About us" ? navData.aboutUs : navData.guidance;
      return (
        <SubmenuContainer
          title={submenuOpen.value}
          hamburgerMenu={hamburgerMenu}
        >
          <OakUL
            $display={"flex"}
            $flexDirection={"column"}
            $ph="spacing-0"
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

    case "Ks4Options": {
      const { subject, title } = getKs4OptionSubjectData(
        navData,
        submenuOpen.value,
      );

      if (!subject?.children) {
        return null;
      }

      return (
        <SubmenuContainer title={title} hamburgerMenu={hamburgerMenu}>
          <TopNavKS4Buttons
            ks4Options={subject.children}
            subject={subject}
            onClick={handleCloseHamburger}
            onExamboardPanelClose={handleCloseHamburger}
            getButtonId={(key) => `teachers-secondary-${subject.slug}-${key}`}
          />
        </SubmenuContainer>
      );
    }
    case "Keystages": {
      const { keystageData, phase } = getKeystageSubjectsData(
        navData,
        submenuOpen.value,
      );
      if (!keystageData) {
        return null;
      }
      return (
        <SubmenuContainer
          title={getKeystageListLabel(keystageData)}
          hamburgerMenu={hamburgerMenu}
          ariaLabel={getKeystageListAriaLabel(keystageData)}
        >
          <TopNavSubjectButtons
            handleClick={(subject: SubjectsMenu, keystageSlug: string) => {
              track.browseRefined({
                platform: "owa",
                product: "teacher lesson resources",
                engagementIntent: "refine",
                componentType: "topnav-browse-button",
                eventVersion: "2.0.0",
                analyticsUseCase: "Teacher",
                filterType: "Subject filter",
                filterValue: subject.subjectSlug,
                activeFilters: { keystages: [keystageSlug] },
                googleLoginHint: null,
                clientEnvironment: null,
              });
              handleCloseHamburger();
            }}
            onExamboardPanelClose={handleCloseHamburger}
            selectedMenu={phase}
            subjects={keystageData.children}
            selectedSubject={null}
            identifyingSlug={keystageData.slug}
            phase={phase}
            getButtonId={(key) =>
              `teachers-${phase}-${keystageData.slug}-${key}`
            }
            onExamBoardPanelOpen={(subject: SubjectsMenu) => {
              track.browseRefined({
                platform: "owa",
                product: "teacher lesson resources",
                engagementIntent: "refine",
                componentType: "topnav-browse-button",
                eventVersion: "2.0.0",
                analyticsUseCase: "Teacher",
                filterType: "Subject filter",
                filterValue: subject.subjectSlug,
                activeFilters: { keystages: ["ks4"] },
                googleLoginHint: null,
                clientEnvironment: null,
              });
              handleNav({ menu: "Ks4Options", value: subject.slug });
            }}
          />
        </SubmenuContainer>
      );
    }
    case "KeystageOptions": {
      const phase = getPhaseSlug(submenuOpen.value);
      const phaseData = navData[phase];
      const keystageOptionItem = phaseData.keystages.children;
      if (!keystageOptionItem) return null;
      return (
        <SubmenuContainer
          title={submenuOpen.value + " key stages"}
          hamburgerMenu={hamburgerMenu}
        >
          <OakFlex
            as="ul"
            $flexDirection={"column"}
            $gap={"spacing-16"}
            $ph="spacing-0"
          >
            {keystageOptionItem.map((child) => (
              <MainMenuButton
                key={child.slug}
                title={getKeystageListLabel(child)}
                onClick={() =>
                  hamburgerMenu.handleNav({
                    menu: "Keystages",
                    value: child.title,
                  })
                }
                track={() => {
                  track.browseRefined({
                    platform: "owa",
                    product: "teacher lesson resources",
                    engagementIntent: "refine",
                    componentType: "topnav-browse-button",
                    eventVersion: "2.0.0",
                    analyticsUseCase: "Teacher",
                    filterType: "Key stage filter",
                    filterValue: child.slug,
                    activeFilters: {},
                    googleLoginHint: null,
                    clientEnvironment: null,
                  });
                }}
              />
            ))}
          </OakFlex>
        </SubmenuContainer>
      );
    }
    case "Phases": {
      const phase = getPhaseSlug(submenuOpen.value);
      const phaseData = navData[phase];
      const phaseItem = phaseData.phases.children;
      if (!phaseItem) return null;
      return (
        <SubmenuContainer
          title={submenuOpen.value + " subjects"}
          hamburgerMenu={hamburgerMenu}
        >
          <TopNavSubjectButtons
            identifyingSlug={phase}
            handleClick={(subject: SubjectsMenu) => {
              track.browseRefined({
                platform: "owa",
                product: "teacher lesson resources",
                engagementIntent: "refine",
                componentType: "topnav-browse-button",
                eventVersion: "2.0.0",
                analyticsUseCase: "Teacher",
                filterType: "Subject filter",
                filterValue: subject.subjectSlug,
                activeFilters: {},
                googleLoginHint: null,
                clientEnvironment: null,
              });
              handleCloseHamburger();
            }}
            selectedMenu={phase}
            subjects={phaseItem}
            selectedSubject={null}
            phase={phase}
            getButtonId={(key) => `teachers-${phase}-${key}`}
            onExamboardPanelClose={handleCloseHamburger}
            onExamBoardPanelOpen={(subject: SubjectsMenu) => {
              track.browseRefined({
                platform: "owa",
                product: "teacher lesson resources",
                engagementIntent: "refine",
                componentType: "topnav-browse-button",
                eventVersion: "2.0.0",
                analyticsUseCase: "Teacher",
                filterType: "Subject filter",
                filterValue: subject.subjectSlug,
                activeFilters: { keystages: ["ks4"] },
                googleLoginHint: null,
                clientEnvironment: null,
              });
              handleNav({ menu: "Ks4Options", value: subject.slug });
            }}
          />
        </SubmenuContainer>
      );
    }
    case "MainMenu":
    default: {
      return <MainMenuContent {...navData} hamburgerMenu={hamburgerMenu} />;
    }
  }
}
