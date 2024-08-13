import { z } from "zod";

export const roleSelectFormSchema = z.object({
  role: z.string({
    errorMap: () => ({
      message: "Select a role",
    }),
  }),
  other: z.string().optional(),
});
export type RoleSelectFormValues = z.infer<typeof roleSelectFormSchema>;
export type RoleSelectFormProps = RoleSelectFormValues & {
  onSubmit: (values: RoleSelectFormValues) => Promise<void>;
};

export const schoolSelectFormSchema = z.object({
  school: z
    .string({
      errorMap: () => ({
        message: "Select school",
      }),
    })
    .min(1, "Select school"),
  schoolName: z.string().optional(),
});
export type SchoolSelectFormValues = z.infer<typeof schoolSelectFormSchema>;
export type SchoolSelectFormProps = SchoolSelectFormValues & {
  onSubmit: (values: SchoolSelectFormValues) => Promise<void>;
};

export type OnboardingFormProps = SchoolSelectFormProps | RoleSelectFormProps;
