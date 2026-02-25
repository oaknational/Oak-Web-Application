import { notFound } from "next/navigation";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { OakBox, OakFlex, OakHeading, OakP } from "@/styles/oakThemeApp";
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
    <OakFlex $flexDirection={"column"} $gap={"spacing-48"} key={u.title}>
      <OakBox>
        <OakBox
          $pa={"spacing-24"}
          $background={"bg-neutral"}
          $btlr={"border-radius-l"}
          $btrr={"border-radius-l"}
          $width={"fit-content"}
          $mr={"spacing-24"} // ensures title section doesn't fill the full width on mobile
        >
          <OakHeading tag="h2" $font={"heading-5"}>
            {u.title}
          </OakHeading>
        </OakBox>
        <OakBox
          $background={"bg-neutral"}
          $pa={"spacing-24"}
          $borderRadius={"border-radius-l"}
          $btlr={"border-radius-square"}
        >
          {u.lessons.map((l) => (
            <OakP key={l.slug}>{l.title}</OakP>
          ))}
        </OakBox>
      </OakBox>
    </OakFlex>
  ));
};

const EyfsPage = withPageErrorHandling(InnerEyfsPage, "eyfs-page::app");

export default EyfsPage;
