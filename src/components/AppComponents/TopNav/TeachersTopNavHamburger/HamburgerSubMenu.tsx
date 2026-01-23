import { ReactNode, useEffect, useRef } from "react";
import {
  OakBox,
  OakPrimaryInvertedButton,
  OakUL,
  OakLeftAlignedButton,
  OakFlex,
} from "@oaknational/oak-components";
import Link from "next/link";

import TopNavSubjectButtons from "../TopNavDropdown/TopNavSubjectButtons";

import {
  getEYFSAriaLabel,
  SubmenuState,
  HamburgerMenuHook,
} from "./TeachersTopNavHamburger";

import {
  SubNavLinks,
  TeachersBrowse,
  TeachersSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { resolveOakHref } from "@/common-lib/urls";

export type NavItemData =
  | { type: "links"; links: SubNavLinks }
  | {
      type: "subjects";
      subjects: TeachersBrowse["keystages"][number]["subjects"];
      keystage: string;
      phase: "primary" | "secondary";
    };

export function SubmenuContainer({
  title,
  children,
  hamburgerMenu,
}: {
  readonly title: SubmenuState;
  readonly children: ReactNode;
  readonly hamburgerMenu: HamburgerMenuHook;
}) {
  const { submenuOpen, handleCloseSubmenu } = hamburgerMenu;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submenuOpen && containerRef.current) {
      const focusableElements =
        containerRef.current.querySelectorAll<HTMLElement>("[href]");
      focusableElements[0]?.focus();
    }
  }, [submenuOpen]);
  return (
    <OakFlex
      $ph={"spacing-40"}
      $pb={"spacing-40"}
      $gap={"spacing-40"}
      $flexDirection={"column"}
      ref={containerRef}
    >
      <OakPrimaryInvertedButton
        iconName="chevron-left"
        aria-label={getEYFSAriaLabel(title)}
        selected={true}
        onClick={() => handleCloseSubmenu()}
      >
        {title}
      </OakPrimaryInvertedButton>

      {children}
    </OakFlex>
  );
}

export function SubmenuContent(
  props: Readonly<TeachersSubNavData & { hamburgerMenu: HamburgerMenuHook }>,
) {
  const { hamburgerMenu, ...navData } = props;
  const { submenuOpen, handleClose } = hamburgerMenu;

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
            $gap={"spacing-16"}
          >
            {links.map((link) => (
              <OakBox key={link.slug}>
                <OakLeftAlignedButton
                  onClick={() => {
                    handleClose();
                  }}
                  element={Link}
                  href={resolveOakHref({
                    page: link.slug,
                  } as Parameters<typeof resolveOakHref>[0])}
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
      const keystage = phaseData.keystages.find(
        (ks) => ks.title === submenuOpen,
      );
      if (!keystage) return null;
      const subjects = keystage.subjects.filter((s) => !s.nonCurriculum);
      const nonCurriculumSubjects = keystage.subjects.filter(
        (s) => s.nonCurriculum,
      );
      return (
        <SubmenuContainer title={submenuOpen} hamburgerMenu={hamburgerMenu}>
          <TopNavSubjectButtons
            selectedMenu={phase}
            subjects={subjects}
            nonCurriculumSubjects={nonCurriculumSubjects}
            keyStageSlug={keystage.slug}
            keyStageTitle={keystage.title}
          />
        </SubmenuContainer>
      );
    }
  }
}
