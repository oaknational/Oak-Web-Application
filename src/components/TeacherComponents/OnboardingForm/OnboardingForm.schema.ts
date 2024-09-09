import { z } from "zod";

const baseSchema = z.object({
  newsletterSignUp: z.boolean(),
});

export const roleSelectFormSchema = z.object({
  ...baseSchema.shape,
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

const ukSchoolSchema = z.object({
  school: z
    .string({
      errorMap: () => ({
        message: "Please select your school",
      }),
    })
    .min(1, "Select school"),
  schoolName: z.string().optional(),
  ...baseSchema.shape,
});
export type UkSchoolFormValues = z.infer<typeof ukSchoolSchema>;

const manualSchoolSchema = z.object({
  manualSchoolName: z
    .string()
    .min(3, "School name must be at least 3 characters long"),

  schoolAddress: z
    .string()
    .min(3, "School address must be at least 3 characters long"),
  ...baseSchema.shape,
});
export type ManualSchoolFormValues = z.infer<typeof manualSchoolSchema>;

export const schoolSelectFormSchema = ukSchoolSchema.or(manualSchoolSchema);

export type SchoolSelectFormValues = z.infer<typeof schoolSelectFormSchema>;
export type SchoolSelectFormProps = SchoolSelectFormValues & {
  onSubmit: (values: SchoolSelectFormValues) => Promise<void>;
};
export const worksInSchoolFormSchema = z.object({
  worksInSchool: z.boolean({
    errorMap: () => ({
      message: "Please select if you work in a school",
    }),
  }),
});
type WorksInSchoolFormValues = z.infer<typeof worksInSchoolFormSchema>;
export type WorksInSchoolFormProps = WorksInSchoolFormValues & {
  onSubmit: (values: WorksInSchoolFormValues) => Promise<void>;
};

const oakSupportSchema = z.object({
  curriculumDesign: z.boolean().optional(),
  departmentResources: z.boolean().optional(),
  enhanceSkills: z.boolean().optional(),
  resourcesInspiration: z.boolean().optional(),
  disruptionLearning: z.boolean().optional(),
});

export const extendedOakSupportSchema = oakSupportSchema
  .merge(ukSchoolSchema)
  .or(oakSupportSchema.merge(manualSchoolSchema));

export type OakSupportSchema = z.infer<typeof extendedOakSupportSchema>;
export type OakSupportFormProps = OakSupportSchema & {
  onSubmit: (values: OakSupportSchema) => Promise<void>;
};

export type OnboardingFormProps =
  | SchoolSelectFormProps
  | RoleSelectFormProps
  | WorksInSchoolFormProps
  | OakSupportFormProps;

export const isSchoolSelectData = (
  d: OnboardingFormProps,
): d is SchoolSelectFormProps => {
  return (
    ("school" in d || "manualSchoolName" in d) &&
    !("curriculumDesign" in d) &&
    !("departmentResources" in d) &&
    !("enhanceSkills" in d) &&
    !("resourcesInspiration" in d) &&
    !("disruptionLearning" in d)
  );
};
