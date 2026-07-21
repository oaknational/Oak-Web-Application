import { OaksImpactSchoolQuoteProps } from ".";

export const fixtureData: OaksImpactSchoolQuoteProps = {
  title: "Ormiston Academies Trust",
  image: {
    alt: "TEST_ALT",
    src: `https://sanity-asset-cdn.thenational.academy/images/cuvjke51/production/b81ee19a35baa3192360a210fda34cc9b21f4fd6-5824x3264.jpg?w=640&fm=webp&q=80&fit=clip&auto=format`,
  },
  subTitle:
    "Ormiston Academies Trust supports pupils in 45 schools across secondary, primary, alternative provision and special schools.",
  quote: {
    quote: [
      "In Ormiston, we value our partnership with Oak, through which we have strengthened the R.E. curriculum in our schools, whilst contributing to a high-quality national resource for all.",
      "Ormiston primary schools are using science and humanities resources to strengthen their curricular offer, and are benefitting from the high quality curriculum design, and opportunities to work in partnership with colleagues at Oak.",
    ],
    authorName: "Tom Rees",
    authorTitle: "CEO, Ormiston Academies Trust",
    authorImageSrc: `https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1698336490/test-images/test_quote_author.jpg`,
  },
};
