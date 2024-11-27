import { z } from "zod";

export const LS_KEY_EMAIL_SCHEMA = z.string().optional();
export const LS_KEY_SCHOOL_SCHEMA = z.object({
  schoolId: z.string().optional(),
  schoolName: z.string().optional(),
});
export const LS_KEY_TERMS_SCHEMA = z.boolean();
export const LS_KEY_TEACHER_SHARE_KIDS_INITIATED_SCHEMA = z.string();
export const LS_KEY_TEACHER_SHARE_KEYS_ACTIVATED_SCHEMA = z.boolean();
export const LS_KEY_TEACHER_SHARE_IDS_CONVERTED_SCHEMA = z.boolean();
