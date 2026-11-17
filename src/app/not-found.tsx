"use client";
import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import TopNavMinimal from "@/components/AppComponents/TopNav/TopNavMinimal";
import ErrorPage from "@/components/GenericPagesComponents/ErrorPane";

export default function NotFound() {
  return (
    <>
      <TopNavMinimal />
      <ErrorPage statusCode={404} />
      <LayoutSiteFooter />
    </>
  );
}
