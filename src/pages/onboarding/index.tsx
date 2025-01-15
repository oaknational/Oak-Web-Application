import { NextPage } from "next";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import OnboardingView from "@/components/TeacherViews/Onboarding/Onboarding.view";

const OnboardingComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OnboardingView />
    </OakThemeProvider>
  );
};

export default OnboardingComponent;
