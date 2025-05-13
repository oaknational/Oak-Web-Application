import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { Wall } from "@/components/AppComponents/Wall";
import AppLayout from "@/components/SharedComponents/AppLayout";
import withFeatureFlag from "@/hocs/withFeatureFlag";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import MyLibraryHeader from "@/components/TeacherComponents/MyLibraryHeader/MyLibraryHeader";

function MyLibraryPage() {
  return (
    <AppLayout seoProps={getSeoProps({ title: "My Library" })}>
      <MyLibraryHeader />
    </AppLayout>
  );
}

export default withFeatureFlag(
  withPageAuthRequired(withOnboardingRequired(MyLibraryPage, Wall), Wall),
  "teacher-save-units",
);
