import { notFound } from "next/navigation";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { OakP } from "@/styles/oakThemeApp";

const InnerEyfsPage = async ({
  params,
}: Readonly<{
  params: Promise<{ subjectSlug: string }>;
}>) => {
  const isEnabled = await getFeatureFlagValue("teachers-eyfs-page", "boolean");
  if (!isEnabled) {
    return notFound();
  }

  const { subjectSlug } = await params;

  return <OakP>Page loaded for {subjectSlug}</OakP>;
};

const EyfsPage = withPageErrorHandling(InnerEyfsPage, "programme-page::app");

export default EyfsPage;
