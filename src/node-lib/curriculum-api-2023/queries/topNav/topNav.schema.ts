import z from "zod";
import { programmeFieldsSchema } from "@oaknational/oak-curriculum-schema";

import curriculumPhaseOptionsSchema from "../curriculumPhaseOptions/curriculumPhaseOptions.schema";

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

export type ProgrammeFactorButton = {
  buttonTitle: string;
  programmeSlug: string;
  href: string;
  programmeFactors?: {
    tier?: {
      slug: "core" | "foundation" | "higher" | null;
      description: "Core" | "Foundation" | "Higher" | null;
    };
    examboard?: { slug: string; title: string };
  };
};

export type SubjectsNavItem = {
  title: string;
  slug: string;
  href: string;
  nonCurriculum: boolean; // enables highlighting subjects that are non curriculum
  programmeSlug: string | null; // will be null when multiple programmes exist
  programmeCount: number; // used to determine whether we should go to the programmes page (more than 1 programme) or directly to the unit listing page (only 1 programme)
  pathwaySlug?: string | null;
  subjectParent?: string | null; // used to determine if subject is a child of another subject (e.g. combined science is a child of science)
  examBoards?: ProgrammeFactorButton[]; // available exam boards for KS4 subjects with multiple programmes
};

export type TeachersBrowseChildItem = {
  type: "keystage" | "phase";
  title: string;
  slug: string;
  description: string;
  children: Array<SubjectsNavItem>;
};

export type TeachersBrowse = {
  title: "Primary" | "Secondary";
  slug: "primary" | "secondary";
  children: Array<TeachersBrowseChildItem>;
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
