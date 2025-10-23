import handler from "../../../../pages/api/curriculum-downloads/index";
import { createNextApiMocks } from "../../../__helpers__/createNextApiMocks";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { createUnit } from "@/fixtures/curriculum/unit";

const fetch = jest.spyOn(global, "fetch") as jest.Mock;

const LAST_REFRESH = new Date();
const LAST_REFRESH_AS_TIME = new Date().getTime();

const curriculumSequenceMock = jest.fn<
  ReturnType<typeof curriculumApi2023.curriculumSequence>,
  []
>(async () => {
  throw new Error("missing");
});
const curriculumOverviewMock = jest.fn<
  ReturnType<typeof curriculumApi2023.curriculumOverview>,
  []
>(async () => {
  return {
    curriculaDesc:
      "Our curriculum is thoughtfully designed to instil confidence and ignite a genuine passion for the language. It systematically nurtures pupils’ critical skills and knowledge until they are firmly grounded, enabling them to write with purpose and read with fluency and enjoyment.\n\nEvery facet of the English domain - spoken language, reading, writing, spelling, handwriting, grammar, vocabulary development, and poetry - is meticulously addressed, both as discrete and interwoven threads. Pupils engage in repeated and diversified practice, steadily progressing through well-defined steps, ensuring that learning is applicable across various contexts.\n\nWe take pride in nurturing students' sense of identity and self-esteem through a rich tapestry of diverse texts, instilling in them a dual identity as both readers and writers. All pupils emerge as exceptional communicators, regardless of their initial starting points, ready for further study and lifelong engagement with reading.",
    subjectTitle: "English",
    phaseTitle: "Secondary",
    examboardTitle: null,
  };
});
const refreshedMVTimeMock = jest.fn<
  ReturnType<typeof curriculumApi2023.refreshedMVTime>,
  []
>(async () => {
  return {
    data: [
      {
        last_refresh_finish: LAST_REFRESH.toISOString(),
        materializedview_name: "mv_curriculum_sequence_b_13_0_6",
      },
    ],
  };
});

const mockSequenceData = {
  units: [createUnit({ slug: "test" })],
};

const curriculumPhaseOptionsMock = jest.fn(async () => {
  return [
    {
      title: "Physical education",
      slug: "physical-education",
      phases: [
        {
          slug: "primary",
          title: "Primary",
        },
        {
          slug: "secondary",
          title: "Secondary",
        },
      ],
      keystages: [
        {
          slug: "ks1",
          title: "Key Stage 1",
        },
        {
          slug: "ks2",
          title: "Key Stage 2",
        },
        {
          slug: "ks3",
          title: "Key Stage 3",
        },
        {
          slug: "ks4",
          title: "Key Stage 4",
        },
      ],
      ks4_options: [
        {
          slug: "aqa",
          title: "AQA",
        },
        {
          slug: "core",
          title: "Core",
        },
        {
          slug: "edexcel",
          title: "Edexcel",
        },
        {
          slug: "gcse",
          title: "GCSE",
        },
        {
          slug: "ocr",
          title: "OCR",
        },
      ],
    },
    {
      title: "Maths",
      slug: "maths",
      phases: [
        {
          slug: "primary",
          title: "Primary",
        },
        {
          slug: "secondary",
          title: "Secondary",
        },
      ],
      keystages: [
        {
          slug: "ks1",
          title: "Key Stage 1",
        },
        {
          slug: "ks2",
          title: "Key Stage 2",
        },
        {
          slug: "ks3",
          title: "Key Stage 3",
        },
        {
          slug: "ks4",
          title: "Key Stage 4",
        },
      ],
      ks4_options: [],
    },
    {
      title: "English",
      slug: "english",
      phases: [
        {
          slug: "primary",
          title: "Primary",
        },
        {
          slug: "secondary",
          title: "Secondary",
        },
      ],
      keystages: [
        {
          slug: "ks1",
          title: "Key Stage 1",
        },
        {
          slug: "ks2",
          title: "Key Stage 2",
        },
        {
          slug: "ks3",
          title: "Key Stage 3",
        },
        {
          slug: "ks4",
          title: "Key Stage 4",
        },
      ],
      ks4_options: [
        {
          slug: "aqa",
          title: "AQA",
        },
        {
          slug: "edexcel",
          title: "Edexcel",
        },
        {
          slug: "eduqas",
          title: "Eduqas",
        },
      ],
    },
  ];
});

jest.mock("../../../../node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    curriculumSequence: () => curriculumSequenceMock(),
    curriculumOverview: () => curriculumOverviewMock(),
    refreshedMVTime: () => refreshedMVTimeMock(),
    curriculumPhaseOptions: () => curriculumPhaseOptionsMock(),
  },
}));

jest.mock("../../../../node-lib/cms", () => ({
  __esModule: true,
  default: {
    curriculumOverviewPage: async () => null,
  },
}));

describe("/api/curriculum-downloads", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    fetch.mockResolvedValue(new Response("", { status: 200 }));
  });

  it("redirect if old cache slug", async () => {
    const { req, res } = createNextApiMocks({
      query: {
        types: ["curriculum-plans"],
        mvRefreshTime: (LAST_REFRESH.getTime() - 1000).toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "published",
        ks4OptionSlug: "aqa",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(307);
  });

  describe("missing", () => {
    it("error is invalid", async () => {
      const { req, res } = createNextApiMocks({
        query: {
          types: ["curriculum-plans"],
          mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
          subjectSlug: "INVALID",
          phaseSlug: "INVALID",
          state: "published",
          ks4OptionSlug: "aqa",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(404);
    });
  });

  it("return 200 if correct cache slug", async () => {
    curriculumSequenceMock.mockResolvedValue(mockSequenceData);
    const { req, res } = createNextApiMocks({
      query: {
        types: ["curriculum-plans"],
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "published",
        ks4OptionSlug: "aqa",
      },
    });
    await handler(req, res);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(res._getStatusCode()).toBe(200);
  });

  it("return 200 if correct cache slug", async () => {
    curriculumSequenceMock.mockResolvedValue(mockSequenceData);
    const { req, res } = createNextApiMocks({
      query: {
        types: ["curriculum-plans"],
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "published",
        ks4OptionSlug: "wjec",
      },
    });
    await handler(req, res);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(res._getStatusCode()).toBe(200);
  });

  it("returns 404 if units is not present", async () => {
    curriculumSequenceMock.mockRejectedValue(new Error("Missing"));
    const { req, res } = createNextApiMocks({
      query: {
        types: ["curriculum-plans"],
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "published",
        ks4OptionSlug: "aqa",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });

  it("returns 404 if examboard not present", async () => {
    curriculumSequenceMock.mockRejectedValue(new Error("Missing"));
    const { req, res } = createNextApiMocks({
      query: {
        types: ["curriculum-plans"],
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "primary",
        state: "published",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });

  it("returns 404 if state is new", async () => {
    const { req, res } = createNextApiMocks({
      query: {
        types: ["curriculum-plans"],
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "new",
        ks4OptionSlug: "aqa",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });
});
