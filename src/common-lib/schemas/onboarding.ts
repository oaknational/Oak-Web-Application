import { z } from "zod";

export const onboardingSchema = z.object({
  isTeacher: z.boolean(),
});
export type OnboardingSchema = z.infer<typeof onboardingSchema>;
