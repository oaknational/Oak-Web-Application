import { notFound } from "next/navigation";
import { Metadata } from "next";

import { EYFSLessonGroupProvider } from "./components/EyfsLessonGroupProvider";
import { EYFSLessonCard } from "./components/EyfsLessonCard";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import { OakBox, OakFlex, OakHeading } from "@/styles/oakThemeApp";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export const metadata: Metadata = {
  title: "Early years foundation stage lesson resources",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

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
        <OakFlex
          $background={"bg-neutral"}
          $pa={"spacing-24"}
          $borderRadius={"border-radius-l"}
          $btlr={"border-radius-square"}
          $flexDirection={"column"}
          $gap={"spacing-20"}
        >
          <EYFSLessonGroupProvider>
            {u.lessons
              .toSorted(
                (a, b) =>
                  (a.orderInUnit ?? Infinity) - (b.orderInUnit ?? Infinity),
              )
              .map((lesson) => (
                <EYFSLessonCard key={lesson.slug} lesson={lesson} />
              ))}
          </EYFSLessonGroupProvider>
        </OakFlex>
      </OakBox>
    </OakFlex>
  ));
};

const EyfsPage = withPageErrorHandling(InnerEyfsPage, "eyfs-page::app");

export default EyfsPage;
