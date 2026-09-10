import z from "zod";
import { programmeFieldsSchema } from "@oaknational/oak-curriculum-schema";

import { KeystageSlug } from "../../shared.schema";
import curriculumPhaseOptionsSchema from "../curriculumPhaseOptions/curriculumPhaseOptions.schema";

import { Tier } from "@/utils/curriculum/types";

export const topNavResponseSchema = z.object({
  programmes: z.array(
    z.object({
      programme_fields: programmeFieldsSchema,
      programme_slug: z.string(),
      features: z.object({ non_curriculum: z.boolean().nullish() }),
      actions: z
        .object({
          programme_field_overrides: z
            .object({
              subject: z.string().nullish(),
            })
            .nullish(),
        })
        .nullish(),
    }),
  ),
  phaseOptions: curriculumPhaseOptionsSchema,
});
export type TopNavResponse = z.infer<typeof topNavResponseSchema>;

export type TeachersSubNavData = {
  primary: TeachersBrowse;
  secondary: TeachersBrowse;
  guidance: NavDropDownButton;
  aboutUs: NavDropDownButton;
  aiExperiments: NavLink;
};

export type PupilsSubNavData = {
  primary: PupilsBrowse;
  secondary: PupilsBrowse;
  help: NavLink;
};

/**
 * Nav menu items: button or link
 */
export type NavLink = {
  title: string;
  slug: string;
  href: string;
  external?: boolean;
};

export type NavButton =
  | NavLink
  | NavDropDownButton
  | PhaseSubjectsMenu
  | KeystageMenu
  | PupilsBrowse;

export type NavDropDownButton = {
  title: string;
  slug: string;
  external?: boolean;
  children: NavLink[];
};

/**
 * Hamburger Menu State
 */

type KeystageState = {
  menu: "Keystages";
  value: KeystageTitle;
};
type PhaseState = {
  menu: "Phases";
  value: PhaseTitle;
};
type KeystageOptionsState = { menu: "KeystageOptions"; value: PhaseTitle };
type OakState = { menu: "OakMenu"; value: "About us" | "Guidance" };
type KS4OptionsState = { menu: "Ks4Options"; value: string };
type MainMenuState = { menu: "MainMenu"; value: null };

export type HamburgerState =
  | MainMenuState
  | OakState
  | KeystageState
  | PhaseState
  | KS4OptionsState
  | KeystageOptionsState
  | null;

/**
 * Navigation menus for dropdown and hamburger
 */
export type TeachersBrowse = {
  keystages: KeystageMenu;
  phases: PhaseSubjectsMenu;
};

type PupilsBrowse = {
  title: PhaseTitle;
  slug: PhaseSlug;
  children: Array<{ title: string; slug: string }>;
};

export type KeystageMenu = {
  title: "Keystages";
  slug: "keystages";
  children: Array<KeystageSubjectsMenu>;
};

export type PhaseSubjectsMenu = {
  title: PhaseTitle;
  slug: PhaseSlug;
  children: Array<SubjectsMenu>;
};

export type KeystageSubjectsMenu = {
  title: KeystageTitle;
  slug: KeystageSlug;
  description: string;
  children: Array<SubjectsMenu>;
};

export type SubjectsMenu = {
  title: string;
  slug: string;
  href: string;
  subjectSlug: string;
  pathwaySlug?: string | null;
  subjectParent?: string | null;
  programmeSlug: string | null;
  programmeCount: number;
  nonCurriculum: boolean;
  children: Array<Ks4OptionsMenu> | null;
};

export type Ks4OptionsMenu = {
  title: string;
  slug: string;
  href: string;
  programmeFactors?: {
    tier: {
      slug: Tier["tier_slug"];
      description: Tier["tier"];
    } | null;
    examboard: { slug: string; title: string } | null;
  };
};

/**
 * Schemas and helper functions
 */

export const isPhaseMenu = (
  u: PhaseSubjectsMenu | KeystageSubjectsMenu,
): u is PhaseSubjectsMenu => {
  return topnavPhaseSchema.safeParse(u.slug).success;
};

export type KeystageTitle =
  | "EYFS"
  | "KS1"
  | "KS2"
  | "KS3"
  | "KS4"
  | "All key stages";

export const topnavPhaseSchema = z.union([
  z.literal("primary"),
  z.literal("secondary"),
]);
export type PhaseSlug = z.infer<typeof topnavPhaseSchema>;
export type PhaseTitle = Capitalize<PhaseSlug>;

export const getPhaseTitle = (phaseSlug: PhaseSlug) =>
  `${phaseSlug[0]?.toUpperCase()}${phaseSlug.slice(1)}` as PhaseTitle;

export const getPhaseSlug = (phaseTitle: PhaseTitle) =>
  phaseTitle.toLowerCase() as PhaseSlug;

// Type guard to check if a nav item opens a dropdown menu (vs being a direct link)
export function isDropdownMenuItem(
  section: NavButton,
): section is
  | NavDropDownButton
  | PhaseSubjectsMenu
  | KeystageMenu
  | PupilsBrowse {
  return "children" in section;
}

export function isTeachersBrowseItem(
  section: unknown,
): section is TeachersBrowse {
  return (
    typeof section === "object" &&
    section !== null &&
    "phases" in section &&
    "keystages" in section
  );
}

export function getItemSlug(item: Record<string, unknown>): string {
  if (isTeachersBrowseItem(item)) {
    return item.phases.slug;
  }
  return item.slug as string;
}

export function getChildrenItems(item: unknown) {
  if (isTeachersBrowseItem(item)) {
    return [item.phases, item.keystages];
  }

  if (typeof item !== "object" || item === null || !("children" in item)) {
    return [];
  }

  const children = item.children;
  if (!Array.isArray(children)) return [];
  return children;
}

export function isNavDropDownButtonItem(
  section: NavButton,
): section is NavDropDownButton {
  return (
    "slug" in section &&
    (section.slug === "guidance" || section.slug === "aboutUs")
  );
}

export const getKeystageSubjectsData = (
  navData: TeachersSubNavData,
  keystage: KeystageTitle,
) => {
  const phase: PhaseSlug = ["KS1", "KS2", "EYFS"].includes(keystage)
    ? "primary"
    : "secondary";
  const phaseData = navData[phase];
  const keystageData = phaseData.keystages.children.find(
    (ks) => ks.title === keystage,
  );
  return { keystageData, phase };
};

export const getKs4OptionSubjectData = (
  navData: TeachersSubNavData,
  subjectSlug: string,
) => {
  const phaseData = navData["secondary"];

  // Look for subject in phase data and fall back to ks data if not found
  // to handle science edge case where subject slug will not match for phase
  let subject = phaseData.phases.children.find((s) => s.slug === subjectSlug);
  let title = `${phaseData.phases.title}, ${subject?.title}`;

  if (!subject) {
    const keystageData = phaseData.keystages.children.find(
      (child) => child.slug === "ks4",
    );
    subject = keystageData?.children.find((s) => s.slug === subjectSlug);
    title = `KS4, ${subject?.title}`;
  }

  return { subject, title };
};
