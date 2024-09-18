import { z } from "zod";

const baseSchema = z.object({
  newsletterSignUp: z.boolean(),
});

export const roleSelectFormSchema = z
  .object({
    ...baseSchema.shape,
    role: z.string({ message: "Please select what describes you best" }),
    other: z.string().trim().optional(),
  })
  .refine((input) => input.role === "Other" && !!input.other, {
    message: "Please tell us what your role is",
    path: ["other"],
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
  manualSchoolName: z.string().trim().min(1),
  schoolAddress: z.string().trim().min(1),
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

export const useOfOakSchema = z.object({
  curriculumDesign: z.boolean().optional(),
  departmentResources: z.boolean().optional(),
  enhanceSkills: z.boolean().optional(),
  resourcesInspiration: z.boolean().optional(),
  disruptionLearning: z.boolean().optional(),
});

export const extendedUseOfOakSchema = useOfOakSchema
  .merge(ukSchoolSchema)
  .or(useOfOakSchema.merge(manualSchoolSchema));

export type UseOfOakFormSchema = z.infer<typeof extendedUseOfOakSchema>;
export type UseOfOakFormProps = UseOfOakFormSchema & {
  onSubmit: (values: UseOfOakFormSchema) => Promise<void>;
};

export type OnboardingFormProps =
  | SchoolSelectFormProps
  | RoleSelectFormProps
  | WorksInSchoolFormProps
  | UseOfOakFormProps;

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
