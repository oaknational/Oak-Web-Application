import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { SubjectPage } from "./Components/SubjectPage";

import { cookiesToObject } from "@/utils/cookiesToObject";
import withPageErrorHandling, {
  AppPageProps,
} from "@/hocs/withPageErrorHandling";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";

export type SchoolsServerPageParams = {
  subjectSlug: string;
};
const SchoolsServerPage = async (
  props: AppPageProps<SchoolsServerPageParams>,
) => {
  const params = await props.params;
  const cookieStore = await cookies();
  const isEnabled = await isFeatureFlagEnabledServer(
    cookiesToObject(cookieStore),
    "schools-journey",
  );

  if (!isEnabled) {
    return notFound();
  }

  return <SubjectPage subjectSlug={params.subjectSlug} />;
};

export default withPageErrorHandling(SchoolsServerPage, "schools-journey");
