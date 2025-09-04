import { z } from "zod";

const ERRORS = {
  school: "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
  email: "Please enter a valid email address",
  name: "Please enter your name",
} as const;

export const schoolIdSchema = z
  .string({
    errorMap: () => ({
      message: ERRORS.school,
    }),
  })
  .min(1, ERRORS.school);

export const nameInputSchema = z
  .string({
    errorMap: () => ({
      message: ERRORS.name,
    }),
  })
  .min(1, ERRORS.name);

export const emailRequiredSchema = z.string().email({
  message: ERRORS.email,
});

const schoolCombinedSchema = z
  .object({
    schoolId: schoolIdSchema.optional(),
    schoolNotListed: z.boolean(),
  })
  .superRefine((values, context) => {
    if (!values.schoolNotListed && values.schoolId === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: ERRORS.school,
        path: ["schoolId"],
      });
    }
  });

const partialSchema = z.object({
  email: emailRequiredSchema,
  name: nameInputSchema,
});

export const newsletterSignupFormSubmitSchema = z.intersection(
  partialSchema,
  schoolCombinedSchema,
);
