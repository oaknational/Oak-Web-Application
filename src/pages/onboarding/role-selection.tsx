import {
  OakFlex,
  OakMaxWidth,
  OakPrimaryButton,
  OakRadioButton,
  OakRadioGroup,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useEffect, useState } from "react";

const RoleSelectionPage = () => {
  const ffEnabled = useFeatureFlagEnabled("use-auth-owa");
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // TODO: extract into shared hook
  useEffect(() => {
    if (ffEnabled === false) {
      router.replace("/404");
    }
  }, [ffEnabled, router]);

  const roleOptions: Record<string, string> = {
    "teacher-training": "Training to become a teacher",
    "teacher-trainer": "Teacher trainer",
    "private-tutor": "Private tutor",
    "adult-helping-child": "Adult helping a child (including homeschooling)",
    "mat-or-lea":
      "Working at multi-academy trust or local educational authority",
    nonprofit: "Working at an educational nonprofit",
  };

  return ffEnabled ? (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakMaxWidth>
        {/* TODO: make shared onboarding form component */}
        <OakFlex
          $flexDirection="column"
          $pa="inner-padding-xl3"
          $dropShadow="drop-shadow-standard"
          $borderRadius="border-radius-s"
          $width="all-spacing-21"
          $gap="space-between-m"
          as="form"
          onSubmit={() =>
            console.log("TODO: something with this data", selectedRole)
          }
        >
          <OakRadioGroup
            name="role-selection"
            $flexDirection="column"
            $alignItems="flex-start"
            $gap="all-spacing-8"
            onChange={(event) => setSelectedRole(event.target.value)}
          >
            {Object.entries(roleOptions).map(([value, label]) => (
              <OakRadioButton
                key={value}
                id={value}
                label={label}
                value={value}
              />
            ))}
          </OakRadioGroup>
          <OakPrimaryButton width="100%" type="submit">
            Continue
          </OakPrimaryButton>
        </OakFlex>
      </OakMaxWidth>
    </OakThemeProvider>
  ) : null;
};

export default RoleSelectionPage;
