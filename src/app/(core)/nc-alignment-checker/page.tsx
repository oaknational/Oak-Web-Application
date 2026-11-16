import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { NcAlignmentCheckerPage } from "./Components/NcAlignmentCheckerPage";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";

export const metadata: Metadata = {
  title: "NC Alignment Checker",
};

const InnerMcpPage = async () => {
  const cookieStore = await cookies();
  const isEnabled =
    (await isFeatureFlagEnabledServer(cookieStore, "nc-alignment-checker")) ??
    false;

  if (!isEnabled) {
    return notFound();
  }
  return <NcAlignmentCheckerPage />;
};

export default withPageErrorHandling(InnerMcpPage, "nc-alignment-checker");
