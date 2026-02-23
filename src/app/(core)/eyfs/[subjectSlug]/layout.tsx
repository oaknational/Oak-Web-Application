import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  OakFlex,
  OakHeading,
  OakMaxWidth,
  OakSmallPrimaryInvertedButton,
} from "@/styles/oakThemeApp";

export default async function EYFSLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ subjectSlug: string }>;
}>) {
  const { subjectSlug } = await params;

  const eyfsPageData = await curriculumApi2023.eyfsPage({ subjectSlug });

  return (
    <OakMaxWidth
      $gap={["spacing-40", "spacing-40", "spacing-64"]}
      $mv={["spacing-48", "spacing-48", "spacing-56"]}
    >
      <OakHeading tag="h1">{eyfsPageData.subjectTitle}</OakHeading>
      <OakFlex $gap="spacing-8">
        {eyfsPageData.subjectTabs.map((subject) => (
          <OakSmallPrimaryInvertedButton key={subject.slug}>
            {subject.title}
          </OakSmallPrimaryInvertedButton>
        ))}
      </OakFlex>
      {children}
    </OakMaxWidth>
  );
}
