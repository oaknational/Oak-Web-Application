"use client";

import { TopNavHamburger } from "@/components/AppComponents/TopNav/TopNavHamburger/TopNavHamburger";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: [integrated-journey] Top Nav & Footer
  return (
    <>
      <TopNavHamburger />
      {children}
    </>
  );
}
