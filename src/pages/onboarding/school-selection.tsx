import { NextPage } from "next";

import SchoolSelectionView from "@/components/TeacherViews/Onboarding/SchoolSelection.view";
import withFeatureFlag from "@/hoc/withFeatureFlag";

const SchoolSelectionComponent: NextPage = () => {
  return <SchoolSelectionView />;
};

const SchoolSelectionPage = withFeatureFlag(
  SchoolSelectionComponent,
  "use-auth-owa",
);

export default SchoolSelectionPage;
