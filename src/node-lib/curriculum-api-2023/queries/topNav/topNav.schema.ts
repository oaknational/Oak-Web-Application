import z from "zod";
import { programmeFieldsSchema } from "@oaknational/oak-curriculum-schema";

import { NavLink } from "@/components/GenericPagesComponents/GenericSummaryCardNavButton/GenericSummaryCardNavButton";
import { OakLinkPropsRequiringPageOnly } from "@/common-lib/urls";

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
});
export type TopNavResponse = z.infer<typeof topNavResponseSchema>;

export type NavLink = {
  title: string;
  slug: OakLinkPropsRequiringPageOnly["page"];
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
  curriculum: NavLink;
  guidance: NavDropDownButton;
  aboutUs: NavDropDownButton;
  aiExperiments: NavLink;
};

export type NavButton = NavLink | NavDropDownButton | TeachersBrowse;

type SubjectsNavItem = {
  title: string;
  slug: string;
  nonCurriculum: boolean; // enables highlighting subjects that are non curriculum
  programmeSlug: string | null; // will be null when multiple programmes exist
  programmeCount: number; // used to determine whether we should go to the programmes page (more than 1 programme) or directly to the unit listing page (only 1 programme)
};

export type TeachersBrowse = {
  title: "Primary" | "Secondary";
  slug: "primary" | "secondary";
  children: Array<{
    title: string;
    slug: string;
    description: string;
    children: Array<SubjectsNavItem>;
  }>;
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
  section: NavLink | NavDropDownButton | TeachersBrowse,
): section is NavDropDownButton | TeachersBrowse {
  return "children" in section;
}
