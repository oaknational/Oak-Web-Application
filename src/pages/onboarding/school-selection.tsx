import { NextPage } from "next";

import SchoolSelectionView from "@/components/TeacherViews/Onboarding/SchoolSelection/SchoolSelection.view";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { Wall } from "@/components/AppComponents/Wall";

const SchoolSelectionComponent: NextPage = () => {
  return <SchoolSelectionView />;
};

export default withPageAuthRequired(SchoolSelectionComponent, Wall);
