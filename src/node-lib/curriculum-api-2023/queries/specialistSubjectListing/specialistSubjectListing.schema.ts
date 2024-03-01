import { z } from "zod";

const specialistProgrammeSchema = z.object({
  combined_programme_fields: z.object({
    subject: z.string(),
    subject_slug: z.string(),
    subject_type: z.string(),
    subject_parent: z.string(),
    developmentstage: z.string().nullish(),
    developmentstage_slug: z.string().nullish(),
  }),
});

export const programmesSchema = z.object({
  therapyProgrammes: z.array(specialistProgrammeSchema),
  specialistProgrammes: z.array(specialistProgrammeSchema),
});

export const specialistSubjectSchema = z.object({
  subjectSlug: z.string(),
  subjectTitle: z.string(),
  unitCount: z.number(),
  lessonCount: z.number(),
  programmeCount: z.number(),
});

const subjectListingSchema = z.object({
  therapies: z.array(specialistSubjectSchema),
  specialist: z.array(specialistSubjectSchema),
});

export const specialistUnitsAndLessonCountSchema = z.object({
  unitCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
  lessonCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
  programmeCount: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
});

export type SpecialistSubject = z.infer<typeof specialistSubjectSchema>;
export type SubjectListingPageData = z.infer<typeof subjectListingSchema>;
export type SubjectListingProgrammes = z.infer<typeof programmesSchema>;
export type SpecialistProgramme = z.infer<typeof specialistProgrammeSchema>;
export default subjectListingSchema;
