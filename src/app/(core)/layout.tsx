import TopNav from "@/components/AppComponents/TopNav/TopNav";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: [integrated-journey]  Footer
  return (
    <>
      <TopNav />
      {children}
    </>
  );
}
