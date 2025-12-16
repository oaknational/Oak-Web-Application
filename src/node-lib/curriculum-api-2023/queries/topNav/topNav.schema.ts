import { programmeFieldsSchema } from "@oaknational/oak-curriculum-schema";
import z from "zod";

export const topNavResponseSchema = z.object({
  teachers: z.array(
    z.object({
      programme_fields: programmeFieldsSchema,
      features: z.object({ non_curriculum: z.boolean().nullish() }),
    }),
  ),
});
export type TopNavResponse = z.infer<typeof topNavResponseSchema>;

export type TeachersSubNavProps = {
  primary: TeachersBrowse;
  secondary: TeachersBrowse;
  guidance: Array<{ slug: string; title: string }>;
  aboutUs: Array<{ slug: string; title: string }>;
};

export type TeachersBrowse = {
  phaseTitle: string;
  phaseSlug: string;
  keystages: Array<{
    title: string;
    slug: string;
    subjects: Array<{ title: string; slug: string; nonCurriculum: boolean }>;
  }>;
};

export type PupilsSubNavProps = {
  primary: PupilsBrowse;
  secondary: PupilsBrowse;
};

type PupilsBrowse = {
  phaseTitle: string;
  phaseSlug: string;
  years: Array<{ title: string; slug: string }>;
};
