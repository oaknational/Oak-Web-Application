import { NextPage } from "next";

import OnboardingView from "@/components/TeacherViews/Onboarding/Onboarding.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { Wall } from "@/components/AppComponents/Wall";

const OnboardingComponent: NextPage = () => {
  return <OnboardingView />;
};

export default withPageAuthRequired(OnboardingComponent, Wall);
