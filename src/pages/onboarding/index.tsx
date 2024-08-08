import { NextPage } from "next";

import OnboardingView from "@/components/TeacherViews/Onboarding/Onboarding.view";
import withFeatureFlag from "@/hoc/withFeatureFlag";

const OnBoarding: NextPage = () => {
  return <OnboardingView />;
};

export default withFeatureFlag(OnBoarding, "use-auth-owa");
