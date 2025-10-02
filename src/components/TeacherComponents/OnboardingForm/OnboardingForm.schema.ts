import { z } from "zod";

const baseSchema = z.object({
  newsletterSignUp: z.boolean(),
});

export const roleSelectFormSchema = z
  .object({
    ...baseSchema.shape,
    role: z.string({
      error: "Please select what describes you best",
    }),
    other: z.string().trim().optional(),
  })
  .refine(
    (input) => {
      if (input.role === "Other") {
        return !!input.other;
      }
      return true;
    },
    {
      path: ["other"],
      error: "Please tell us what your role is",
    },
  );

export type RoleSelectFormValues = z.infer<typeof roleSelectFormSchema>;
export type RoleSelectFormProps = RoleSelectFormValues & {
  onSubmit: (values: RoleSelectFormValues) => Promise<void>;
};

const ukSchoolSchema = z.object({
  school: z
    .string({
      error: () => "Please select your school",
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
    error: () => "Please select if you work in a school",
  }),
});
type WorksInSchoolFormValues = z.infer<typeof worksInSchoolFormSchema>;
export type WorksInSchoolFormProps = WorksInSchoolFormValues & {
  onSubmit: (values: WorksInSchoolFormValues) => Promise<void>;
};

const oakSupportKeys = [
  "curriculumDesign",
  "departmentResources",
  "enhanceSkills",
  "resourcesInspiration",
  "disruptionLearning",
] as const;
export type OakSupportKey = (typeof oakSupportKeys)[number];

export const useOfOakSchema = z.object({
  curriculumDesign: z.boolean().optional(),
  departmentResources: z.boolean().optional(),
  enhanceSkills: z.boolean().optional(),
  resourcesInspiration: z.boolean().optional(),
  disruptionLearning: z.boolean().optional(),
  submitMode: z.union([z.literal("continue"), z.literal("skip")]).nullish(),
});

export const extendedUseOfOakSchema = useOfOakSchema
  .merge(ukSchoolSchema)
  .or(useOfOakSchema.merge(manualSchoolSchema))
  .refine(
    (input) => {
      if (input.submitMode === "continue") {
        // If continuing then we require at least one
        // option to have been selected
        return oakSupportKeys.some((key) => input[key]);
      }

      return true;
    },
    {
      message: "Please select the ways Oak can support you",
      path: ["root"],
    },
  )
  .transform((input) => {
    if (input.submitMode === "skip") {
      // If skipping then we omit any options the user may
      // have selected
      const output = { ...input };
      for (const key of oakSupportKeys) {
        delete output[key];
      }

      return output;
    }

    return input;
  });

export type UseOfOakFormSchema = z.input<typeof extendedUseOfOakSchema>;
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
