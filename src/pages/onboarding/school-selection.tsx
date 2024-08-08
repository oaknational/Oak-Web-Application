import { NextPage } from "next";

import SchoolSelectionView from "@/components/TeacherViews/Onboarding/SchoolSelection.view";
import withFeatureFlag from "@/hoc/withFeatureFlag";

const RoleSelection: NextPage = () => {
  return <SchoolSelectionView />;
};

export default withFeatureFlag(RoleSelection, "use-auth-owa");
