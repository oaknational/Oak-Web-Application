import { notFound } from "next/navigation";

import { EYFSHeader } from "./components/EyfsHeader/EyfsHeader";
import { EYFSNavigation } from "./components/EyfsNavigation";
import { getCachedEyfsPageData } from "./getCachedEyfsPageData";

import OakError from "@/errors/OakError";
import { OakFlex } from "@/styles/oakThemeApp";

export default async function EYFSLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ subjectSlug: string }>;
}>) {
  const { subjectSlug } = await params;

  try {
    const eyfsPageData = await getCachedEyfsPageData(subjectSlug);

    return (
      <OakFlex
        $gap={["spacing-40", "spacing-48", "spacing-64"]}
        $pv={["spacing-48", "spacing-48", "spacing-64"]}
        $ph={["spacing-20", "spacing-40", "spacing-12"]}
        $mh={"auto"}
        $maxWidth={["100%", "100%", "spacing-1280"]}
        $flexDirection={"column"}
      >
        <EYFSHeader subjectTitle={eyfsPageData.subjectTitle} />
        <EYFSNavigation subjectTabs={eyfsPageData.subjectTabs} />
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
