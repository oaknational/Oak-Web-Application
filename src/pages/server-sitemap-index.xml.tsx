import { getServerSideSitemapIndex } from "next-sitemap";
import { GetServerSideProps } from "next";

// It's possible to generate all of the sitemaps on the server side, not just the dynamic ones.
// https://www.npmjs.com/package/next-sitemap

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to source urls from cms or other dynamic source
  // const urls = await fetch('https//example.com/api')

  return getServerSideSitemapIndex(ctx, [
    "https://not_a_site.com/made_up_dynamic_page1.html",
    "https://not_a_site.com/made_up_dynamic_page1.html",
  ]);
};

// Default export to prevent next.js errors
export default function SitemapIndex() {
  // All the work is done in getServerSideProps
}
