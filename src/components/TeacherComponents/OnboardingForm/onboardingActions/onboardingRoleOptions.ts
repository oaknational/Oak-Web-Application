export const onboardingRoleOptions = {
  "teacher-training": "Training to become a teacher",
  "teacher-trainer": "Teacher trainer",
  "private-tutor": "Private tutor",
  "adult-helping-child":
    "Adult helping a child, e.g. with revision, homeschooling",
  "mat-or-lea": "Working at multi-academy trust or local educational authority",
  nonprofit: "Working at an educational nonprofit",
  other: "Other",
} as const;

export type OnboardingRoleType = keyof typeof onboardingRoleOptions;
export type OnboardingRoleValue =
  (typeof onboardingRoleOptions)[OnboardingRoleType];
