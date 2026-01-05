import TopNav from "@/components/AppComponents/TopNav/TopNav";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopNav />
      <main id="main">{children}</main>
      {/* TD: [integrated-journey]  Footer */}
    </>
  );
}
