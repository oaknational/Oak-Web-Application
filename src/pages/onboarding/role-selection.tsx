import { NextPage } from "next";

import RoleSelectionView from "@/components/TeacherViews/Onboarding/RoleSelection/RoleSelection.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { Wall } from "@/components/AppComponents/Wall";

const RoleSelectionComponent: NextPage = () => {
  return <RoleSelectionView />;
};

export default withPageAuthRequired(RoleSelectionComponent, Wall);
