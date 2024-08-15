import { NextPage } from "next";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import OnboardingView from "@/components/TeacherViews/Onboarding/Onboarding.view";
import withFeatureFlag from "@/hocs/withFeatureFlag";

const OnboardingComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OnboardingView />
    </OakThemeProvider>
  );
};

const OnboardingPage = withFeatureFlag(OnboardingComponent, "use-auth-owa");

export default OnboardingPage;
