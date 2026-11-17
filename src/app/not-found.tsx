"use client";
import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import TopNavMinimal from "@/components/AppComponents/TopNav/TopNavMinimal";
import NotFoundPane from "@/components/GenericPagesComponents/NotFoundPane";

export default function NotFound() {
  return (
    <>
      <TopNavMinimal />
      <NotFoundPane statusCode={404} />
      <LayoutSiteFooter />
    </>
  );
}
