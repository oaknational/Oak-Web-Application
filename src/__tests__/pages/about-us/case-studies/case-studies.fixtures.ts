import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { mockPortableTextBlocks } from "@/fixtures/curriculum/programmeSequenceYearData.fixtures";

export function caseStudyFixture(number: number) {
  return {
    title: `TEST_TITLE_${number}`,
    tag: "primary",
    summaryRaw: portableTextFromString(`TEST_SUMMARY_${number}`),
    content: [
      {
        heading: "TEST_HEADING_1",
        label: "TEST_LABEL_1",
        anchorSlug: {
          current: "test-anchor-slug-1",
        },
        contentRaw: portableTextFromString("TEST_CONTENT_1"),
      },
      {
        heading: "TEST_HEADING_2",
        label: "TEST_LABEL_2",
        anchorSlug: {
          current: "test-anchor-slug-2",
        },
        contentRaw: [
          ...portableTextFromString("Text alongside media"),
          {
            _key: "embedded-image",
            _type: "imageWithAltText",
            altText: "A classroom using Oak",
            isPresentational: false,
            asset: {
              _id: "image-d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320-png",
              url: "https://cdn.sanity.io/images/cuvjke51/production/d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320.png",
            },
          },
          {
            _key: "embedded-video",
            _type: "video",
            title: "Embedded case study video",
            video: {
              asset: {
                assetId: "embedded-asset-id",
                playbackId: "embedded-playback-id",
                thumbTime: null,
              },
            },
            transcript: portableTextFromString("Embedded video transcript"),
          },
        ],
      },
    ],
    showGetInTouchPanel: true,
    getInTouchPanel: {
      personName: "TEST_PERSON_NAME",
      personImage: {
        altText: null,
        isPresentational: true,
        asset: {
          _id: "image-d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320-png",
          url: "https://cdn.sanity.io/images/cuvjke51/production/d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320.png",
        },
        hotspot: null,
      },
      jobRole: "TEST_JOB_ROLE",
      institutionName: "TEST_INSTITUTION_NAME",
    },
    video: {
      title: "Test Video",
      video: {
        asset: {
          assetId: "test-asset-id",
          playbackId: "test-playback-id",
          thumbTime: null,
        },
      },
      transcript: [mockPortableTextBlocks[0]],
    },
    slug: {
      current: `test-${number}`,
    },
    image: {
      altText: "Test image alt text",
      isPresentational: false,
      asset: {
        _id: "test-image-asset-id",
        url: "https://example.com/test-image.jpg",
      },
      hotspot: null,
    },
    textRaw: portableTextFromString("TEST_TEXT_RAW"),
    publishedAt: `2026-01-30`,
  };
}

export const caseStudy = caseStudyFixture(1);

export const videoCaseStudy = {
  ...caseStudy,
  title: "TEST_TITLE_VIDEO",
  slug: {
    current: `test-video`,
  },
  tag: null,
  summaryRaw: null,
  content: null,
  showGetInTouchPanel: false,
  getInTouchPanel: null,
};

export const otherCaseStudies = [
  caseStudyFixture(2),
  caseStudyFixture(3),
  videoCaseStudy,
];
