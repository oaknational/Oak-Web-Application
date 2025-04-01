import { GetServerSideProps } from "next";
import { getServerSideSitemapLegacy } from "next-sitemap";

import { buildAllUrlFields } from "@/pages-helpers/pupil/sitemap-pages/sitemap-pages-helper";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSideSitemapLegacy(
    context,
    await buildAllUrlFields({ firstHalf: false }),
  );
};

// Default export to prevent Next.js errors
export default function Sitemap() {
  return null;
}
