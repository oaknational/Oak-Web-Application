import { NextPage } from "next";

import OnboardingView from "@/components/TeacherViews/Onboarding/Onboarding.view";
import withFeatureFlag from "@/hoc/withFeatureFlag";

const OnboardingComponent: NextPage = () => {
  return <OnboardingView />;
};

const OnboardingPage = withFeatureFlag(OnboardingComponent, "use-auth-owa");

export default OnboardingPage;
