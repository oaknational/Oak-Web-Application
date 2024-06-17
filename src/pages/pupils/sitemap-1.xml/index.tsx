import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import { buildAllUrlFields } from "@/pages-helpers/pupil/sitemap-pages/sitemap-pages-helper";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSideSitemap(
    context,
    await buildAllUrlFields({ firstHalf: false }),
  );
};

// Default export to prevent next.js errors
export default function Sitemap() {}
