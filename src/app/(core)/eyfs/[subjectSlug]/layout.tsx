import { OakHeading, OakMaxWidth } from "@/styles/oakThemeApp";

export default async function EYFSLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ subjectSlug: string }>;
}>) {
  const { subjectSlug } = await params;
  return (
    <OakMaxWidth
      $gap={["spacing-40", "spacing-40", "spacing-64"]}
      $mv={["spacing-48", "spacing-48", "spacing-56"]}
    >
      <OakHeading tag="h1">{subjectSlug}</OakHeading>
      {children}
    </OakMaxWidth>
  );
}
