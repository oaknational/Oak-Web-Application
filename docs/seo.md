# SEO

## Sitemaps and robots.txt

The config for generating the sitemaps and robots.txt at build time are here [next-sitemap.config.js](../next-seo.config.ts).

## Meta tags

Each page is currently given a no-index metatag from config here [src/browser-lib/seo/DefaultSeo.tsx](../src/browser-lib/seo/DefaultSeo.tsx)

## Title, Description, OpenGraph Data

Each page should have basic meta data added via the <SEO> tag [src/browser-lib/seo/Seo.tsx](../src/browser-lib/seo/Seo.tsx).

## JSON-LD

Each page should have JSON-LD data added via [src/browser-lib/seo/getJsonLd.tsx](../src/browser-lib/seo/getJsonLd.tsx)
