# SEO

## Sitemaps and robots.txt

The config for generating the sitemaps and robots.txt at build time are here [next-sitemap.config.js](../next-sitemap.config.js).

## Meta tags

Noindex and nofollow metatags can be set globally from config here [src/browser-lib/seo/DefaultSeo.tsx](../src/browser-lib/seo/DefaultSeo.tsx)

## Title, Description, OpenGraph Data

Each page should have basic meta data added via the <SEO> tag [src/browser-lib/seo/Seo.tsx](../src/browser-lib/seo/Seo.tsx).

### Guidance

- Titles should be between 50-60 characters long
- Titles should contain app name
- Descriptions should be between 150-300 characters long

## JSON-LD

Each page should have JSON-LD data added via [src/browser-lib/seo/getJsonLd.tsx](../src/browser-lib/seo/getJsonLd.tsx)
