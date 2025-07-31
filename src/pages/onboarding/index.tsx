import { NextPage } from "next";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import OnboardingView from "@/components/TeacherViews/Onboarding/Onboarding.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { Wall } from "@/components/AppComponents/Wall";

const OnboardingComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OnboardingView />
    </OakThemeProvider>
  );
};

export default withPageAuthRequired(OnboardingComponent, Wall);
