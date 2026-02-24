import { notFound } from "next/navigation";

import { EYFSHeader } from "./components/EyfsHeader/EyfsHeader";

import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { OakFlex, OakSmallPrimaryInvertedButton } from "@/styles/oakThemeApp";

export default async function EYFSLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ subjectSlug: string }>;
}>) {
  const { subjectSlug } = await params;

  try {
    const eyfsPageData = await curriculumApi2023.eyfsPage({ subjectSlug });

    return (
      <OakFlex
        $gap={["spacing-40", "spacing-40", "spacing-64"]}
        $mv={["spacing-48", "spacing-48", "spacing-56"]}
        $ph={["spacing-20", "spacing-40", "spacing-12"]}
        $mh={"auto"}
        $maxWidth={["100%", "100%", "spacing-1280"]}
        $flexDirection={"column"}
      >
        <EYFSHeader subjectTitle={eyfsPageData.subjectTitle} />
        <OakFlex $gap="spacing-8">
          {eyfsPageData.subjectTabs.map((subject) => (
            <OakSmallPrimaryInvertedButton key={subject.slug}>
              {subject.title}
            </OakSmallPrimaryInvertedButton>
          ))}
        </OakFlex>
        {children}
      </OakFlex>
    );
  } catch (error) {
    if (error instanceof OakError) {
      if (error.config.responseStatusCode === 404) {
        return notFound();
      }
    }
    // TD: [integrated journey] error reporting
    throw error;
  }
}
