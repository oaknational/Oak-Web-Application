import { z } from "zod";

export const LS_KEY_EMAIL_SCHEMA = z.string();
export const LS_KEY_SCHOOL_SCHEMA = z.object({
  schoolId: z.string().optional(),
  schoolName: z.string().optional(),
});
export const LS_KEY_TERMS_SCHEMA = z.boolean();
