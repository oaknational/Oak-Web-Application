import { NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import withFeatureFlag from "@/hocs/withFeatureFlag";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import HowCanOakSupport from "@/components/TeacherViews/Onboarding/HowCanOakSupport/HowCanOakSupport.view";

const RoleSelectionComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <HowCanOakSupport />
    </OakThemeProvider>
  );
};

const HowCanOakSupportPage = withFeatureFlag(
  withPageAuthRequired(RoleSelectionComponent),
  "teacher-download-auth",
  "with-login",
);

export default HowCanOakSupportPage;
