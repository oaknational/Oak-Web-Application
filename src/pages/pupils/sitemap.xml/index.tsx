import { GetServerSideProps } from "next";
import { getServerSideSitemapLegacy } from "next-sitemap";

import { buildAllUrlFields } from "@/pages-helpers/pupil/sitemap-pages/sitemap-pages-helper";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSideSitemapLegacy(
    context,
    await buildAllUrlFields({ firstHalf: true }),
  );
};

// Default export to prevent next.js errors
export default function Sitemap() {}
