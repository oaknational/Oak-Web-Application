# SEO

## Sitemaps and robots.txt

The config for generating the sitemaps and robots.txt at build time are here [next-sitemap.config.js](../next-sitemap.config.js).

We also have server-side generated sitemaps for dynamic routes (routes with slugs) which return `fallback: "blocking"` from `getStaticPaths`. Those need to be server side because we typically don't know all (or any) of the paths at build time, e.g. [src/pages/blog/sitemap.xml/index.tsx](../src/pages/blog/sitemap.xml/index.tsx). The sever side sitemap pages themselves are excluded from the main sitemap, but referenced in the sitemap index. If you add a new server side sitemap you also need to add the path to that page to the `serversideSitemapPaths` variable in [next-sitemap.config.js](../next-sitemap.config.js).

The server side sitemaps cannot themselves be under a dynamic path, because that would mean the paths to them
couldn't be known without making data API calls, and that means we couldn't easily specify the paths to them
in the next-sitemap.config.js file (not without duplicating some Next routing functionality). Instead we create server side sitemaps on static routes that specify all the dynamic path pages under that route, e.g. [src/pages/beta/teachers/key-stages/sitemap.xml/index.tsx](../src/pages/beta/teachers/key-stages/sitemap.xml/index.tsx).

## Meta tags

Each page is currently given a no-index metatag from config here [src/browser-lib/seo/DefaultSeo.tsx](../src/browser-lib/seo/DefaultSeo.tsx)

## Title, Description, OpenGraph Data

Each page should have basic meta data added via the <SEO> tag [src/browser-lib/seo/Seo.tsx](../src/browser-lib/seo/Seo.tsx).

### Guidance

- Titles should be between 50-60 characters long
- Titles should contain app name
- Descriptions should be between 150-300 characters long

## JSON-LD

Each page should have JSON-LD data added via [src/browser-lib/seo/getJsonLd.tsx](../src/browser-lib/seo/getJsonLd.tsx)
