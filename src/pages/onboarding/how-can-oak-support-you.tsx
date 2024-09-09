import { NextPage } from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import withFeatureFlag from "@/hocs/withFeatureFlag";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import OakSupport from "@/components/TeacherViews/Onboarding/OakSupport/OakSupport.view";

const RoleSelectionComponent: NextPage = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakSupport />
    </OakThemeProvider>
  );
};

const HowCanOakSupportPage = withFeatureFlag(
  withPageAuthRequired(RoleSelectionComponent),
  "use-auth-owa",
);

export default HowCanOakSupportPage;
