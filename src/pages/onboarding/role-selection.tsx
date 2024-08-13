import { NextPage } from "next";

import RoleSelectionView from "@/components/TeacherViews/Onboarding/RoleSelection.view";
import withFeatureFlag from "@/hoc/withFeatureFlag";

const RoleSelectionComponent: NextPage = () => {
  return <RoleSelectionView />;
};

const RoleSelectionPage = withFeatureFlag(
  RoleSelectionComponent,
  "use-auth-owa",
);

export default RoleSelectionPage;
