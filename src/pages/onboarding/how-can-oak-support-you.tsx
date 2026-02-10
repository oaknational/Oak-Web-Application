import { NextPage } from "next";

import HowCanOakSupport from "@/components/TeacherViews/Onboarding/HowCanOakSupport/HowCanOakSupport.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { Wall } from "@/components/AppComponents/Wall";

const RoleSelectionComponent: NextPage = () => {
  return <HowCanOakSupport />;
};

export default withPageAuthRequired(RoleSelectionComponent, Wall);
