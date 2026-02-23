import { notFound } from "next/navigation";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { OakFlex, OakHeading, OakP } from "@/styles/oakThemeApp";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

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

  const eyfsPageData = await curriculumApi2023.eyfsPage({ subjectSlug });
  const units = Object.values(eyfsPageData.units);

  return units.map((u) => (
    <OakFlex $flexDirection={"column"} $gap={"spacing-24"} key={u.title}>
      <OakHeading tag="h2">{u.title}</OakHeading>
      {u.lessons.map((l) => (
        <OakP key={l.slug}>{l.title}</OakP>
      ))}
    </OakFlex>
  ));
};

const EyfsPage = withPageErrorHandling(InnerEyfsPage, "eyfs-page::app");

export default EyfsPage;
