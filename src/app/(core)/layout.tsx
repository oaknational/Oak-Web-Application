import TopNav from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export default async function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const topNavProps = await curriculumApi2023.topNav();

  // TODO: [integrated-journey]  Footer
  return (
    <>
      <TopNav {...topNavProps} />
      {children}
    </>
  );
}
