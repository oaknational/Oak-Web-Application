import { ReactNode, useEffect, useRef } from "react";
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
import { TopNavKS4Buttons } from "../TopNavDropdown/TopNavKS4Buttons";

import { getEYFSAriaLabel, HamburgerMenuHook } from "./TeachersTopNavHamburger";
import { MainMenuContent } from "./HamburgerMainMenu";

import {
  SubjectsMenu,
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
  readonly title: string;
  readonly description?: string;
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
        aria-label={getEYFSAriaLabel(title)}
        selected={true}
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
          {description || title}
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
  const { submenuOpen, handleCloseSubmenu, handleNav, handleCloseHamburger } =
    hamburgerMenu;

  if (!submenuOpen) return null;

  switch (submenuOpen.menu) {
    case "OakMenu": {
      const links =
        submenuOpen.value === "About us" ? navData.aboutUs : navData.guidance;
      return (
        <SubmenuContainer
          title={submenuOpen.menu}
          hamburgerMenu={hamburgerMenu}
        >
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
                    handleCloseSubmenu();
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

    case "Ks4Options": {
      const phaseData = navData["secondary"];
      const keystage = phaseData.children?.find((ks) => ks.title === "KS4");
      const subject = keystage?.children?.find(
        (s) => s.slug === submenuOpen.value,
      );
      if (!keystage || !subject || !subject.children) {
        return null;
      }
      return (
        <SubmenuContainer
          title={`${keystage.title}, ${subject.title}`}
          hamburgerMenu={hamburgerMenu}
        >
          <TopNavKS4Buttons
            ks4Options={subject.children}
            subject={subject}
            parentId={`teachers-secondary-${keystage.slug}-${subject.slug}`}
            onClick={handleCloseHamburger}
            onExamboardPanelClose={handleCloseHamburger}
          />
        </SubmenuContainer>
      );
    }
    case "Keystages": {
      if (!submenuOpen.value) return null;
      const phase = ["KS1", "KS2", "EYFS"].includes(submenuOpen.value ?? "")
        ? "primary"
        : "secondary";
      const phaseData = navData[phase];
      const keystage = phaseData.children?.find(
        (ks) => ks.title === submenuOpen.value,
      );

      if (!keystage) {
        return null;
      }
      const subjects = keystage.children;

      return (
        <SubmenuContainer
          description={keystage.description}
          title={submenuOpen.value}
          hamburgerMenu={hamburgerMenu}
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
            subjects={subjects}
            selectedSubject={null}
            keyStageSlug={keystage.slug}
            phase={phase}
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
