import { oaksImpactPageSchema } from "./aboutPages";

describe("oaksImpactPageSchema", () => {
  const page = {
    content: [
      {
        header: {
          introText: "Impact intro",
          video: {
            title: "Impact video",
            video: {
              asset: {
                assetId: "asset-id",
                playbackId: "playback-id",
                thumbTime: null,
              },
            },
          },
          videoDescription: "Video description",
        },
        statsSection: {
          textBlock: {
            title: "Our impact",
            bodyPortableText: [],
          },
          stats: [
            {
              icon: { darkModeImage: {} },
              heading: "Schools",
              textRaw: [],
            },
          ],
        },
        schoolQuotes: {
          heading: "What schools say",
          cards: [],
        },
      },
    ],
    caseStudies: [],
  };

  it("parses the page and transforms content from a tuple to an object", () => {
    const result = oaksImpactPageSchema.parse(page);

    expect(result.content).toEqual(page.content[0]);
    expect(result.caseStudies).toEqual([]);
  });

  it("rejects content that does not contain exactly one object", () => {
    expect(() =>
      oaksImpactPageSchema.parse({ ...page, content: [] }),
    ).toThrow();
  });
});
