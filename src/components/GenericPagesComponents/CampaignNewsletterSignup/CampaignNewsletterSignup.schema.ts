import { z } from "zod";

const ERRORS = {
  school: "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
  email: "Please enter a valid email address",
  name: "Please enter your name",
  role: "Please enter your role",
  howCanWeHelp: "Please enter how can we help",
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
        path: ["schoolId", "school"],
      });
    }
  });

export const partialNewsletterSchema = z.object({
  email: emailRequiredSchema,
  name: nameInputSchema,
});

export const newsletterSignupFormSubmitSchema = z.intersection(
  partialNewsletterSchema,
  schoolCombinedSchema,
);

export const newsletterSignupRoleSchema = z.object({
  role: z
    .string({
      errorMap: () => ({
        message: ERRORS.role,
      }),
    })
    .min(1, ERRORS.role),
});

export const newsletterSignupHowCanWeHelpSchema = z.object({
  howCanWeHelp: z
    .string({
      errorMap: () => ({
        message: ERRORS.howCanWeHelp,
      }),
    })
    .min(1, ERRORS.howCanWeHelp),
});

export type CampaignNewsletterSignUpFormProps = z.infer<
  typeof newsletterSignupFormSubmitSchema
>;
