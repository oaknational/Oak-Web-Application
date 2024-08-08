import { NextPage } from "next";

import RoleSelectionView from "@/components/TeacherViews/Onboarding/RoleSelection.view";
import withFeatureFlag from "@/hoc/withFeatureFlag";

const RoleSelection: NextPage = () => {
  return <RoleSelectionView />;
};

export default withFeatureFlag(RoleSelection, "use-auth-owa");
