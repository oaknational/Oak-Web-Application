import { programmeFieldsSchema } from "@oaknational/oak-curriculum-schema";
import z from "zod";

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

export type TeachersSubNavData = {
  primary: TeachersBrowse;
  secondary: TeachersBrowse;
  guidance: Array<{
    slug: string;
    title: string;
    external?: boolean;
  }>;
  aboutUs: Array<{
    slug: string;
    title: string;
    external?: boolean;
  }>;
};

export type TeachersBrowse = {
  phaseTitle: string;
  phaseSlug: string;
  keystages: Array<{
    title: string;
    slug: string;
    subjects: Array<{
      title: string;
      subjectSlug: string;
      nonCurriculum: boolean; // enables highlighting subjects that are non curriculum
      programmeSlug: string | null; // will be null when multiple programmes exist
      programmeCount: number; // used to determine whether we should go to the programmes page (more than 1 programme) or directly to the unit listing page (only 1 programme)
    }>;
  }>;
};

export type PupilsSubNavData = {
  primary: PupilsBrowse;
  secondary: PupilsBrowse;
};

type PupilsBrowse = {
  phaseTitle: string;
  phaseSlug: string;
  years: Array<{ title: string; slug: string }>;
};
