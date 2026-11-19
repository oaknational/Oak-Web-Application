import { NcAlignmentCheckerLandingPageBlock } from "@/common-lib/cms-types/ncAlignmentChecker";

export const basic: NcAlignmentCheckerLandingPageBlock<"NcAlignmentCheckerLandingPageQuotes"> =
  {
    _key: "test",
    __typename: "NcAlignmentCheckerLandingPageQuotes",
    quotes: [
      {
        attribution: "Firstname Surname",
        image: {
          asset: {
            _id: "1",
            url: "https://cdn.sanity.io/images/cuvjke51/fix-adopt-2368-add-image-to-quote/fe20f52637a818f5dcb397565b8c7a5d15fb7bba-367x382.png?w=2000&fit=max&auto=format&dpr=2",
          },
          isPresentational: true,
        },
        organisation: "Secondary School",
        role: "Head",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur",
      },
      {
        attribution: "Firstname Surname",
        image: {
          asset: {
            _id: "2",
            url: "https://cdn.sanity.io/images/cuvjke51/fix-adopt-2368-add-image-to-quote/fe20f52637a818f5dcb397565b8c7a5d15fb7bba-367x382.png?w=2000&fit=max&auto=format&dpr=2",
          },
          isPresentational: true,
        },
        organisation: "Secondary School",
        role: "Head",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur",
      },
    ],
  } as const;
