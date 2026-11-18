import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { SchoolsPage } from "./Components/SchoolsPage";

import { cookiesToObject } from "@/utils/cookiesToObject";
import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";

const SchoolsServerPage = async () => {
  const cookieStore = await cookies();
  const isEnabled = await isFeatureFlagEnabledServer(
    cookiesToObject(cookieStore),
    "schools-journey",
  );

  if (!isEnabled) {
    return notFound();
  }

  return <SchoolsPage />;
};

export default withPageErrorHandling(SchoolsServerPage, "schools-journey");
