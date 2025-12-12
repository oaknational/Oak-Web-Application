import TopNav from "@/components/AppComponents/TopNav/TopNav";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: [integrated-journey] Top Nav & Footer
  return (
    <>
      <TopNav />
      {children}
    </>
  );
}
