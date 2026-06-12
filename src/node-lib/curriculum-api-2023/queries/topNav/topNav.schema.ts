import z from "zod";
import { programmeFieldsSchema } from "@oaknational/oak-curriculum-schema";

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

export type NavLink = {
  title: string;
  slug: string;
  href: string;
  external?: boolean;
};

export type NavDropDownButton = {
  title: string;
  slug: string;
  external?: boolean;
  children: NavLink[];
};

export type TeachersSubNavData = {
  primary: TeachersBrowse;
  secondary: TeachersBrowse;
  guidance: NavDropDownButton;
  aboutUs: NavDropDownButton;
  aiExperiments: NavLink;
};

export type NavButton =
  | NavLink
  | NavDropDownButton
  | TeachersBrowse
  | PupilsBrowse;

export type KeystageMenu = {
  title: string;
  slug: string;
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

export type TeachersBrowse = {
  title: "Primary" | "Secondary";
  slug: "primary" | "secondary";
  children: Array<KeystageMenu>;
};

export type PupilsSubNavData = {
  primary: PupilsBrowse;
  secondary: PupilsBrowse;
  help: NavLink;
};

type PupilsBrowse = {
  title: "Primary" | "Secondary";
  slug: "primary" | "secondary";
  children: Array<{ title: string; slug: string }>;
};

// Type guard to check if a nav item opens a dropdown menu (vs being a direct link)
export function isDropdownMenuItem(
  section: NavButton,
): section is NavDropDownButton | TeachersBrowse | PupilsBrowse {
  return "children" in section;
}

export function isTeachersBrowseItem(
  section: NavButton,
): section is TeachersBrowse {
  return section.slug === "primary" || section.slug === "secondary";
}

export function isNavDropDownButtonItem(
  section: NavButton,
): section is NavDropDownButton {
  return section.slug === "guidance" || section.slug === "aboutUs";
}
